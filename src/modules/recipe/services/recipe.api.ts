/**
 * Services API purs - I/O uniquement
 * Pas de logique métier, pas de transformation
 * Juste des appels HTTP
 */

import { apiClient } from "@/lib/api/client";
import type { DeclarableRecipe } from "@/types/recipe.type";

/**
 * Récupère la liste des recipes déclarables
 */
export async function fetchDeclarableRecipes(
  accessToken?: string
): Promise<DeclarableRecipe[] | null> {
  const res = await apiClient.get(
    "/search/recipe/recipe/declarable",
    undefined,
    accessToken
  );
  if (!res) return null;

  // Retourner directement la réponse - la normalisation sera faite dans l'adapter/query
  return (res as { data?: DeclarableRecipe[] })?.data ?? null;
}

/**
 * Récupère la définition du formulaire pour une recipe
 * Retourne la réponse brute de l'API - sera normalisée dans l'adapter
 */
export async function fetchRecipeFormDefinition(
  recipeId: string,
  accessToken?: string
): Promise<unknown> {
  const res = await apiClient.get(
    `/list/recipe/recipe/${recipeId}/forms`,
    undefined,
    accessToken
  );

  if (!res) return null;

  // Retourner la réponse brute - normalisation dans l'adapter
  return res;
}

/**
 * Récupère les valeurs initiales pour le mode édition
 */
export async function fetchRecipeInitialValues(
  recipeId: string,
  declarationId: string,
  accessToken?: string
): Promise<Record<string, unknown> | null> {
  const res = await apiClient.get(
    `/list/recipe/recipe/${recipeId}/declarations/${declarationId}`,
    undefined,
    accessToken
  );

  if (!res) return null;

  // Extraire les données - adapter si nécessaire selon la structure API
  const data = (res as { data?: Record<string, unknown> })?.data;
  return data ?? null;
}

/**
 * Soumet un formulaire (création)
 */
export async function submitRecipeForm(
  recipeId: string,
  payload: Record<string, unknown>,
  accessToken?: string
): Promise<{ data: Record<string, unknown>; message?: string } | null> {
  // Inclure le recipeId dans le payload si nécessaire
  const finalPayload = {
    ...payload,
    recipeId, // S'assurer que le recipeId est inclus dans le payload
  };

  const res = await apiClient.post(
    "/create/operation/operation/declaration",
    finalPayload,
    undefined,
    accessToken
  );

  console.log("res", res);

  if (!res) return null;

  const message =
    typeof (res as { message?: string }).message === "string"
      ? (res as { message: string }).message
      : undefined;

  const data = ((res as { data?: Record<string, unknown> })?.data ??
    res) as Record<string, unknown>;

  return { data, message };
}

/**
 * Met à jour un formulaire (édition)
 */
export async function updateRecipeForm(
  recipeId: string,
  declarationId: string,
  payload: Record<string, unknown>,
  accessToken?: string
): Promise<{ data: Record<string, unknown>; message?: string } | null> {
  const res = await apiClient.put(
    `/list/recipe/recipe/${recipeId}/declarations/${declarationId}`,
    payload,
    undefined,
    accessToken
  );

  if (!res) return null;

  const message =
    typeof (res as { message?: string }).message === "string"
      ? (res as { message: string }).message
      : undefined;

  const data = ((res as { data?: Record<string, unknown> })?.data ??
    res) as Record<string, unknown>;

  return { data, message };
}
