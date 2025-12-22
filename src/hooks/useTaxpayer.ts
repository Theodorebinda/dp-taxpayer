"use client";

import { useApiQuery, useApiMutation } from "./useApi";
import { getTaxpayerById, updateTaxpayer } from "@/services/taxpayer.service";
import type { TaxpayerAccount } from "@/types/taxpayer-account.type";
import { useSession } from "next-auth/react";
import { useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";

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

/**
 * Hook TanStack Query mutation pour mettre à jour les informations d'un contribuable
 * @param taxpayerId - ID du contribuable
 * @returns Mutation pour mettre à jour le contribuable
 */
export function useUpdateTaxpayer(taxpayerId: string) {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const accessToken = useMemo(() => {
    const token = (session as unknown as { accessToken?: string } | null)
      ?.accessToken;
    return typeof token === "string" ? token : undefined;
  }, [session]);

  return useApiMutation<
    Record<string, unknown> | FormData,
    { data: Record<string, unknown>; message?: string }
  >(
    async (payload) => {
      if (!accessToken) {
        throw new Error("Token d'accès manquant");
      }
      const result = await updateTaxpayer(taxpayerId, payload, accessToken);
      if (!result) {
        throw new Error("Échec de la mise à jour du contribuable");
      }
      return result;
    },
    {
      onSuccess: () => {
        // Invalider la query du contribuable pour rafraîchir les données
        queryClient.invalidateQueries({ queryKey: ["taxpayer", taxpayerId] });
      },
    }
  );
}
