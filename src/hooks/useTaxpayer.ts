"use client";

import { useApiQuery } from "./useApi";
import { getTaxpayerById } from "@/services/taxpayer.service";
import type { TaxpayerAccount } from "@/types/taxpayer-account.type";
import { useSession } from "next-auth/react";
import { useMemo } from "react";

/**
 * Hook TanStack Query pour récupérer les informations d'un contribuable
 * @param taxpayerId - ID du contribuable (optionnel, si non fourni, utilise l'ID de la session)
 * @returns Query result avec les données du contribuable
 */
export function useTaxpayer(taxpayerId?: string) {
  const { data: session } = useSession();
  const accessToken = useMemo(() => {
    const token = (session as unknown as { accessToken?: string } | null)
      ?.accessToken;
    return typeof token === "string" ? token : undefined;
  }, [session]);

  const effectiveId = useMemo(() => {
    if (taxpayerId) return taxpayerId;
    const userId = (session?.user as { id?: string } | undefined)?.id;
    return userId ?? null;
  }, [taxpayerId, session]);

  return useApiQuery<TaxpayerAccount | false>(
    ["taxpayer", effectiveId],
    async () => {
      if (!effectiveId) return false;
      return await getTaxpayerById(effectiveId, accessToken);
    },
    {
      enabled: Boolean(effectiveId && accessToken),
      staleTime: 2 * 60 * 1000, // 2 minutes
      refetchOnWindowFocus: true,
    }
  );
}
