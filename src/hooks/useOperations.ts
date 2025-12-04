"use client";

import { useApiQuery } from "./useApi";
import { listOperations } from "@/services/operations.service";
import type { OperationView } from "@/types/operation-view.type";
import { useSession } from "next-auth/react";
import { useMemo } from "react";

/**
 * Hook TanStack Query pour récupérer les opérations d'un contribuable
 * @param taxpayerId - ID du contribuable
 * @param params - Paramètres optionnels pour filtrer les opérations
 * @returns Query result avec la liste des opérations
 */
export function useOperations(
  taxpayerId: string | null | undefined,
  params?: Record<string, unknown>
) {
  const { data: session } = useSession();
  const accessToken = useMemo(() => {
    const token = (session as unknown as { accessToken?: string } | null)
      ?.accessToken;
    return typeof token === "string" ? token : undefined;
  }, [session]);

  return useApiQuery<OperationView[]>(
    ["operations", taxpayerId, params],
    async () => {
      if (!taxpayerId) return [];
      return await listOperations(taxpayerId, params, accessToken);
    },
    {
      enabled: Boolean(taxpayerId && accessToken),
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
    }
  );
}
