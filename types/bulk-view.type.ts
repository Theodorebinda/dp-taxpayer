type PaiementStatus =
  | "PENDING"
  | "REFUNDED"
  | "PAID"
  | "UNPAID"
  | "PARTIALLY_PAID"
  | "CANCELED"
  | "CREATED";

type OperationStatus =
  | "PENDING"
  | "CLOSED"
  | "REJECTED"
  | "REVERSED"
  | "POSED"
  | "CREATED";

type TransactionType = "DEBIT" | "DEBIT";

export type InnerAgentData = {
  id: string;
  firstName: string;
  lastName: string;
  photo: string;
  mobile: string;
  mail: string;
  operationCreatedDate: string;
};

export type BulkTransaction = {
  id: string;
  amount: number;
  paiemendStatus: PaiementStatus;
  operationStatus: OperationStatus;
  transactionType: TransactionType;
  createdAt: string;
  beneficiaryName: string;
  skip: boolean;
  currency: {
    id: string;
    symbol: string;
  } | null;
  mobileOperator: string;
  externalId: string;
  failedReason: string;
};

export interface BulkOperationView {
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
  transactions: BulkTransaction[];
  approvalStatus:
    | "PENDING"
    | "IN_PROGRESS"
    | "APPROVED"
    | "REJECTED"
    | "CANCELLED"
    | "SKIPPED";
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
  organization: {
    id: string;
    name: string;
  };
  _count: {
    transactions: number;
  };
}
