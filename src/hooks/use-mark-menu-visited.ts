"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { markMenuVisited } from "@/services/applications.service";
import { ApplicationType, SideMenuType } from "@/types/application.type";

type Variables = {
  applicationId: string;
  menuId: string;
};

type Context = {
  previousMenus?: SideMenuType[];
};

export function useMarkMenuVisited() {
  const queryClient = useQueryClient();
  return useMutation<unknown, unknown, Variables, Context>({
    mutationFn: ({ menuId }) => markMenuVisited(menuId),
    onMutate: async ({ applicationId, menuId }) => {
      await queryClient.cancelQueries({ queryKey: ["menus", applicationId] });
      const previousMenus = queryClient.getQueryData<SideMenuType[]>([
        "menus",
        applicationId,
      ]);
      if (previousMenus) {
        const visitedMenus = previousMenus.map((menu) =>
          menu.id === menuId ? { ...menu, visited: true } : menu
        );
        queryClient.setQueryData(["menus", applicationId], visitedMenus);
      }

      const applications = queryClient.getQueryData<ApplicationType[]>([
        "applications",
      ]);
      if (applications) {
        const next = applications.map((app) =>
          app.id === applicationId
            ? {
                ...app,
                menus: (app.menus ?? []).map((menu) =>
                  menu.id === menuId ? { ...menu, visited: true } : menu
                ),
              }
            : app
        );
        queryClient.setQueryData(["applications"], next);
      }

      return { previousMenus };
    },
    onError: (_error, variables, context) => {
      if (context?.previousMenus) {
        queryClient.setQueryData(
          ["menus", variables.applicationId],
          context.previousMenus
        );
      }
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["menu-stats"] });
      queryClient.invalidateQueries({
        queryKey: ["menus", variables.applicationId],
      });
    },
  });
}
