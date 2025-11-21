"use client";

import { useApiQuery, useApiMutation } from "./useApi";
import {
  getDeclarationFormFields,
  createDeclaration,
  updateDeclaration,
  getDeclaration,
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

/**
 * Hook TanStack Query mutation pour mettre à jour une déclaration
 * @returns Mutation pour mettre à jour une déclaration
 */
export function useUpdateDeclaration() {
  const { data: session } = useSession();
  const accessToken = useMemo(() => {
    const token = (session as unknown as { accessToken?: string } | null)
      ?.accessToken;
    return typeof token === "string" ? token : undefined;
  }, [session]);

  return useApiMutation<
    {
      type: DeclarationType;
      id: string | number;
      payload: Record<string, unknown>;
    },
    { data: Record<string, unknown>; message?: string }
  >(
    async ({ type, id, payload }) => {
      if (!accessToken) {
        throw new Error("Token d'accès manquant");
      }
      const result = await updateDeclaration(type, id, payload, accessToken);
      if (!result) {
        throw new Error("Échec de la mise à jour de la déclaration");
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

/**
 * Hook TanStack Query pour récupérer une déclaration existante
 * @param type - Type de déclaration
 * @param id - ID de la déclaration
 * @returns Query result avec les données de la déclaration
 */
export function useGetDeclaration(
  type: DeclarationType | null,
  id: string | number | null
) {
  const { data: session } = useSession();
  const accessToken = useMemo(() => {
    const token = (session as unknown as { accessToken?: string } | null)
      ?.accessToken;
    return typeof token === "string" ? token : undefined;
  }, [session]);

  return useApiQuery<
    { data: Record<string, unknown>; form?: Record<string, unknown> } | false
  >(
    ["declaration", type, id],
    async () => {
      if (!type || !id) return false;
      return await getDeclaration(type, id, accessToken);
    },
    {
      enabled: Boolean(type && id && accessToken),
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
    }
  );
}
