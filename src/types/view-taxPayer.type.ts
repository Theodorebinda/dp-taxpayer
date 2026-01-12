import { SimpleIndicatorProps } from "./types";

export interface TaxPayer {
  id: string;
  mobile: string;
  uniqueId: string;
  typeId: string;
  firstName: string;
  middleName: string;
  lastName: string;
  physicalAddress: string | null;
  email: string | null;
  additionnalData: Record<string, any> | null;
  createdAt: Date;
  meta: Record<string, any> | null;
  types:
    | {
        taxPayerType: {
          id: string;
          name: string;
        };
      }[]
    | null;
  originEntity: {
    id: string;
    name: string;
  } | null;
  user: {
    id: string;
    meta: Record<string, any> | null;
    photo: string | null;
    allowedDeviceNumber: number;
    type: string;
    role: {
      id: string;
      name: string;
    } | null;
    userDevices: {
      id: string;
      os: string | null;
      browser: string | null;
      isActive: boolean;
    }[];
  } | null;
  documents: {
    id: string;
    expireOn: Date;
    isCopy: boolean;
    isActive: boolean;
    serialNumber: string;
    createdAt: Date;
    template: {
      id: string;
      name: string;
      type: {
        id: string;
        name: string;
      };
      description: string;
    };
  }[];
  possessions: {
    _count: {
      children: number;
      operations: number;
    };
    id: string;
    uniqueNumber: string | null;
    description: string | null;
    additionnalData: Record<string, any> | null;
    createdAt: Date;
    type?: {
      id: true;
      name: true;
    };
    operations: {
      recipe: {
        id: string;
        name: string;
      } | null;
      isClosed: boolean;
      paiedAmount: number; // Peut-être string selon votre modèle
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
      createdAt: string;
    }[];
    parent: {
      id: string;
      uniqueNumber: string | null;
    } | null;
  }[];
  _count: {
    possessions: number;
  };
  stats: SimpleIndicatorProps[];
}
