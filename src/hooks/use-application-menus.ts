"use client";

import { useQuery } from "@tanstack/react-query";
import { getApplicationMenus } from "@/services/applications.service";

export function useApplicationMenus(applicationId?: string | null) {
  return useQuery({
    queryKey: ["menus", applicationId],
    queryFn: () => getApplicationMenus(applicationId as string),
    enabled: Boolean(applicationId),
    staleTime: 5 * 60 * 1000,
  });
}
