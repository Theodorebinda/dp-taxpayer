type PaiementStatus =
  | "PENDING"
  | "REFUNDED"
  | "PAID"
  | "UNPAID"
  | "PARTIALLY_PAID"
  | "CANCELED";

type OperationStatus = "PENDING" | "CLOSED" | "REJECTED" | "REVERSED" | "POSED";

type TransactionType = "DEBIT" | "DEBIT";

export type InnerPossession = {
  id: string;
  uniqueNumber: string;
  type: {
    id: string;
    name: string;
  };
  additionnalData: {
    endCity: string;
    compagny: string;
    startCity: string;
    dutyStation: string;
    busPlateNumber: string;
  };
  description: string;
  createdAt: string;
  parent: { id: string; uniqueNumber: string } | null;
  taxPayer: {
    id: string;
    firstName: string;
    middleName: string;
    lastName: string;
    uniqueId: string;
    email: string;
    mobile: string;
  };
};

export type InnerAgentData = {
  id: string;
  firstName: string;
  lastName: string;
  photo: string;
  mobile: true;
  mail: true;
};

export interface OperationView {
  id: string;
  reason: string | null;
  serialNumber: string | null;
  status: OperationStatus;
  paiementStatus: PaiementStatus;
  action: "TAXATION" | "LIQUIDATION" | "PAIEMENT";
  totalAmount: number;
  paiedAmount: number;
  isClosed: boolean;
  isScanned: boolean;
  meta: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
  updatedByUserId: string;
  createdByUserId: string;
  transactions: {
    id: string;
    amount: number;
    paiemendStatus: PaiementStatus;
    operationStatus: OperationStatus;
    transactionType: TransactionType;
    createdAt: string;
    wallet: {
      id: string;
      uniqueNumber: string | null;
    } | null;
    currency: {
      id: string;
      symbol: string;
    } | null;
  }[];
  recipe: {
    id: string;
    name: string;
    description: string;
    currency: {
      id: string;
      symbol: string;
    };
  };
  initByAgent: InnerAgentData;
  closedByAgent: InnerAgentData;
  possession: InnerPossession;
  organization: {
    id: string;
    name: string;
  };
  entity: {
    id: string;
    name: string;
  };
  controledByAgents: {
    id: string;
    createdAt: string;
    firstScan: boolean;
    agent: InnerAgentData;
  }[];
  documentInstances: DocumentInstances[];
  operationRecipeStepOffices: {
    recipeStep: {
      step: {
        name: string;
      };
    };
  }[];
}

type DocumentInstances = {
  id: string;
  expireOn: Date;
  serialNumber: string;
  template: {
    id: string;
    name: string;
    description: string;
  };
};
