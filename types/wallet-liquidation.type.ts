type PaiementStatus =
  | "PENDING"
  | "REFUNDED"
  | "PAID"
  | "UNPAID"
  | "PARTIALLY_PAID"
  | "CANCELED";

type OperationStatus = "PENDING" | "CLOSED" | "REJECTED" | "REVERSED" | "POSED";

type TransactionType = "DEBIT" | "DEBIT";

export type InnerAgentData = {
  id: string;
  firstName: string;
  lastName: string;
  photo: string;
  mobile: string;
  mail: string;
};

export interface WalletLiquidation {
  id: string;
  endAt: string | null;
  amount: number;
  status: OperationStatus;
  startAt: string;
  approvalStatus:
    | "PENDING"
    | "IN_PROGRESS"
    | "APPROVED"
    | "REJECTED"
    | "CANCELLED"
    | "SKIPPED";
  agent: InnerAgentData;
  wallet: {
    id: string;
    solde: number;
    currency: {
      id: string;
      symbol: string;
      formatKey: string;
    };
  };
  validatedByAgent: InnerAgentData | null;
  currency: {
    id: string;
    symbol: string;
    formatKey: string;
  };
  organization: {
    id: string;
    name: string;
  };
  operations: Operation[];
}

export type Operation = {
  id: string;
  totalAmount: number;
  paiedAmount: number;
  currency: {
    id: string;
    symbol: string;
    formatKey: string;
  };
  initByAgent: {
    id: string;
    firstName: string;
    lastName: string;
  };
  closedByAgent: {
    id: string;
    firstName: string;
    lastName: string;
  } | null;
  action: "TAXATION" | "LIQUIDATION" | "PAIEMENT";
  createdAt: Date;
  updatedAt: Date;
};
