"use client";

import { useApiQuery, useApiMutation } from "./useApi";
import {
  getDeclarableRecipes,
  getRecipeFormFields,
  createRecipeDeclaration,
  type RecipeFormFieldsPayload,
} from "@/services/recipe.service";
import { useSession } from "next-auth/react";
import { useMemo } from "react";
import type { DeclarableRecipe } from "@/types/recipe.type";

/**
 * Hook TanStack Query pour récupérer la liste des recipes déclarables
 * @returns Query result avec la liste des recipes
 */
export function useDeclarableRecipes() {
  const { data: session } = useSession();
  const accessToken = useMemo(() => {
    const token = (session as unknown as { accessToken?: string } | null)
      ?.accessToken;
    return typeof token === "string" ? token : undefined;
  }, [session]);

  return useApiQuery<DeclarableRecipe[] | false>(
    ["declarable-recipes"],
    async () => {
      return await getDeclarableRecipes(accessToken);
    },
    {
      enabled: Boolean(accessToken),
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
    }
  );
}

/**
 * Hook TanStack Query pour récupérer les champs de formulaire d'une recipe
 * @param recipeId - ID de la recipe
 * @returns Query result avec les champs du formulaire
 */
export function useRecipeForm(recipeId: string | null) {
  const { data: session } = useSession();
  const accessToken = useMemo(() => {
    const token = (session as unknown as { accessToken?: string } | null)
      ?.accessToken;
    return typeof token === "string" ? token : undefined;
  }, [session]);

  return useApiQuery<RecipeFormFieldsPayload | false>(
    ["recipe-form", recipeId],
    async () => {
      if (!recipeId) return false;
      return await getRecipeFormFields(recipeId, accessToken);
    },
    {
      enabled: Boolean(recipeId && accessToken),
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
    }
  );
}

/**
 * Hook TanStack Query mutation pour créer une déclaration pour une recipe
 * @returns Mutation pour créer une déclaration
 */
export function useCreateRecipeDeclaration() {
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
      const result = await createRecipeDeclaration(
        recipeId,
        payload,
        accessToken
      );
      if (!result) {
        throw new Error("Échec de la création de la déclaration");
      }
      return result;
    },
    {
      onSuccess: (data) => {
        // Invalider les queries liées aux recipes
        // queryClient.invalidateQueries({ queryKey: ["declarable-recipes"] });
      },
    }
  );
}
