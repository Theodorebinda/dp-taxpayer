/**
 * Types pour les recipes déclarables
 */
export type RecipeType = "TAX" | "IMPOT" | "REDEVANCE" | null;

export interface DeclarableRecipe {
  id: string;
  name: string;
  recipeType: RecipeType;
  pricing: number;
  currency: {
    id: string;
    formatKey: string;
  } | null;
  entity: {
    id: string;
    name: string;
  } | null;
  description: string;
  generatingFact: string | null;
  activitySector: {
    id: string;
    name: string;
  } | null;
}

export interface DeclarableRecipesResponse {
  code: number;
  message: string;
  data: DeclarableRecipe[];
}
