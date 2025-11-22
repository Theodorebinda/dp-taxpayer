/**
 * TanStack Query hooks pour les recipes
 * Source unique de données pour les recipes
 */

"use client";

import { useSession } from "next-auth/react";
import { useMemo } from "react";
import { useApiQuery, useApiMutation } from "@/hooks/useApi";
import {
  fetchDeclarableRecipes,
  fetchRecipeFormDefinition,
  fetchRecipeInitialValues,
  submitRecipeForm,
  updateRecipeForm,
} from "../services/recipe.api";
import { normalizeRecipeFormResponse } from "@/modules/formEngine/adapters/normalizeRecipeFormResponse";
import type { DeclarableRecipe } from "@/types/recipe.type";
import type { NormalizedRecipeForm } from "@/modules/formEngine/types";

/**
 * Hook pour récupérer la liste des recipes déclarables
 */
export function useDeclarableRecipes() {
  const { data: session } = useSession();
  const accessToken = useMemo(() => {
    const token = (session as unknown as { accessToken?: string } | null)
      ?.accessToken;
    return typeof token === "string" ? token : undefined;
  }, [session]);

  return useApiQuery<DeclarableRecipe[] | null>(
    ["recipe", "declarable"],
    async () => {
      return await fetchDeclarableRecipes(accessToken);
    },
    {
      enabled: Boolean(accessToken),
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
    }
  );
}

/**
 * Hook pour récupérer la définition du formulaire d'une recipe
 * Normalise automatiquement la réponse API
 */
export function useRecipeFormDefinition(recipeId: string | null) {
  const { data: session } = useSession();
  const accessToken = useMemo(() => {
    const token = (session as unknown as { accessToken?: string } | null)
      ?.accessToken;
    return typeof token === "string" ? token : undefined;
  }, [session]);

  return useApiQuery<NormalizedRecipeForm | null>(
    ["recipe", "form-definition", recipeId],
    async () => {
      if (!recipeId) return null;

      const rawResponse = await fetchRecipeFormDefinition(
        recipeId,
        accessToken
      );
      if (!rawResponse) return null;

      // Normaliser la réponse via l'adapter
      const normalized = normalizeRecipeFormResponse(rawResponse);
      return normalized;
    },
    {
      enabled: Boolean(recipeId && accessToken),
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
    }
  );
}

/**
 * Hook pour récupérer les valeurs initiales en mode édition
 */
export function useRecipeInitialValues(
  recipeId: string | null,
  declarationId: string | null
) {
  const { data: session } = useSession();
  const accessToken = useMemo(() => {
    const token = (session as unknown as { accessToken?: string } | null)
      ?.accessToken;
    return typeof token === "string" ? token : undefined;
  }, [session]);

  return useApiQuery<Record<string, unknown> | null>(
    ["recipe", "initial-values", recipeId, declarationId],
    async () => {
      if (!recipeId || !declarationId) return null;

      return await fetchRecipeInitialValues(
        recipeId,
        declarationId,
        accessToken
      );
    },
    {
      enabled: Boolean(recipeId && declarationId && accessToken),
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
    }
  );
}

/**
 * Hook pour soumettre un formulaire (création)
 */
export function useSubmitRecipeForm() {
  const { data: session } = useSession();
  const accessToken = useMemo(() => {
    const token = (session as unknown as { accessToken?: string } | null)
      ?.accessToken;
    return typeof token === "string" ? token : undefined;
  }, [session]);

  return useApiMutation<
    { recipeId: string; payload: Record<string, unknown> },
    { data: Record<string, unknown>; message?: string }
  >(
    async ({ recipeId, payload }) => {
      if (!accessToken) {
        throw new Error("Token d'accès manquant");
      }

      const result = await submitRecipeForm(recipeId, payload, accessToken);

      if (!result) {
        throw new Error("Échec de la soumission du formulaire");
      }

      return result;
    },
    {
      onSuccess: () => {
        // Invalider les queries liées si nécessaire
        // queryClient.invalidateQueries({ queryKey: ["recipe"] });
      },
    }
  );
}

/**
 * Hook pour mettre à jour un formulaire (édition)
 */
export function useUpdateRecipeForm() {
  const { data: session } = useSession();
  const accessToken = useMemo(() => {
    const token = (session as unknown as { accessToken?: string } | null)
      ?.accessToken;
    return typeof token === "string" ? token : undefined;
  }, [session]);

  return useApiMutation<
    {
      recipeId: string;
      declarationId: string;
      payload: Record<string, unknown>;
    },
    { data: Record<string, unknown>; message?: string }
  >(
    async ({ recipeId, declarationId, payload }) => {
      if (!accessToken) {
        throw new Error("Token d'accès manquant");
      }

      const result = await updateRecipeForm(
        recipeId,
        declarationId,
        payload,
        accessToken
      );

      if (!result) {
        throw new Error("Échec de la mise à jour du formulaire");
      }

      return result;
    },
    {
      onSuccess: () => {
        // Invalider les queries liées si nécessaire
      },
    }
  );
}
