"use client";

import { useApiQuery, useApiMutation } from "./useApi";
import {
  getDeclarationFormFields,
  createDeclaration,
  type DeclarationFormFieldsPayload,
} from "@/services/declaration.service";
import type { DeclarationType } from "@/types/declaration-types";
import { useSession } from "next-auth/react";
import { useMemo } from "react";

/**
 * Hook TanStack Query pour récupérer les champs de formulaire d'une déclaration
 * @param type - Type de déclaration
 * @returns Query result avec les champs du formulaire
 */
export function useDeclarationForm(type: DeclarationType | null) {
  const { data: session } = useSession();
  const accessToken = useMemo(() => {
    const token = (session as unknown as { accessToken?: string } | null)
      ?.accessToken;
    return typeof token === "string" ? token : undefined;
  }, [session]);

  return useApiQuery<DeclarationFormFieldsPayload | false>(
    ["declaration-form", type],
    async () => {
      if (!type) return false;
      return await getDeclarationFormFields(type, accessToken);
    },
    {
      enabled: Boolean(type && accessToken),
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
    }
  );
}

/**
 * Hook TanStack Query mutation pour créer une déclaration
 * @returns Mutation pour créer une déclaration
 */
export function useCreateDeclaration() {
  const { data: session } = useSession();
  const accessToken = useMemo(() => {
    const token = (session as unknown as { accessToken?: string } | null)
      ?.accessToken;
    return typeof token === "string" ? token : undefined;
  }, [session]);

  return useApiMutation<
    { type: DeclarationType; payload: Record<string, unknown> },
    { data: Record<string, unknown>; message?: string }
  >(
    async ({ type, payload }) => {
      if (!accessToken) {
        throw new Error("Token d'accès manquant");
      }
      const result = await createDeclaration(type, payload, accessToken);
      if (!result) {
        throw new Error("Échec de la création de la déclaration");
      }
      return result;
    },
    {
      onSuccess: (data) => {
        // Invalider les queries liées aux déclarations
        // queryClient.invalidateQueries({ queryKey: ["declarations"] });
      },
    }
  );
}
