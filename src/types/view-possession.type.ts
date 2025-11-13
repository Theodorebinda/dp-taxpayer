import { SimpleIndicatorProps } from "./types";

export interface Possession {
  id: string;
  uniqueNumber: string;
  description: string;
  additionnalData: Record<string, any> | null;
  type: {
    id: string;
    name: string;
  };
  createdAt: string; // or Date
  meta: Record<string, any>;
  taxPayer: {
    mobile: string;
    firstName: string;
    middleName: string;
    lastName: string;
    physicalAddress: string | null;
    email: string | null;
  };
  operations: {
    recipe: {
      id: string;
      name: string;
    } | null;
    isClosed: boolean;
    paiedAmount: number;
    initByAgent: {
      id: string;
      firstName: string | null;
      lastName: string | null;
    } | null;
    closedByAgent: {
      id: string;
      firstName: string | null;
      lastName: string | null;
    } | null;
    id: string;
    paiementStatus: string;
    createdAt: string; // or Date
  }[];
  recipes: {
    id: string;
    recipe: {
      id: string;
      name: string;
      description: string;
      pricing: number;
      currency: { formatKey: string };
    };
  }[];
  _count: {
    operations: number;
    recipes: number;
  };
  stats: SimpleIndicatorProps[];
  logs: {
    id: string;
    action: string;
    affectedColumns: string;
  }[];
}
