export interface Currency {
  id: string;
  name: string;
  symbol: string;
}

export interface ActivitySector {
  id: string;
  name: string;
}

// Type principal
export interface RecipeViewModel {
  id: string;
  name: string;
  pricing: number;
  parentId: string | null;
  entityId: string;
  recipeType: "TAX" | "IMPOT" | "REDEVANCE";
  calculateInPercentage: boolean;
  description: string;
  generatingFact: string | null;
  isActive: boolean;
  meta: Record<string, unknown>; // ou un type plus spécifique si vous connaissez la structure
  createdAt: string | Date;
  currency: Currency | null;
  activitySector: ActivitySector | null;
}

export interface StepList {
  id: string;
  nameCode: string;
  name: string;
  description: string;
  orderIndex: number;
  parentId: string | null;
  createdAt: string | Date;
  recipeSteps: { office: { id: string; name: string } }[];
  children: StepList[];
}
