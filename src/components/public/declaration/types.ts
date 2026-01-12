import { ApiInputType } from "@/types/types";

export type Recipe = {
  id: string;
  name: string;
  recipeType: "TAX" | "IMPOT";
  currency: { id: string; formatKey: string };
  entity: { id: string; name: string };
  description: string;
  generatingFact: string;
  activitySector: { id: string; name: string };
};

export type FormStep = {
  property: string;
  id: string;
  title: string;
  description?: string;
  fields: ApiInputType[];
};

export type FormData = Record<string, any>;
