"use client";

import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { getApplicationMenus } from "@/services/applications.service";

export function usePrefetchMenus(applicationId?: string | null) {
  const queryClient = useQueryClient();
  return useCallback(() => {
    if (!applicationId) return;
    queryClient.prefetchQuery({
      queryKey: ["menus", applicationId],
      queryFn: () => getApplicationMenus(applicationId),
      staleTime: 5 * 60 * 1000,
    });
  }, [applicationId, queryClient]);
}
