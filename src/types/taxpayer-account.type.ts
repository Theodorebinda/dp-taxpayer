/**
 * Types pour la réponse API /read/taxpayer/{id}/account
 */

export type TaxpayerPossession = {
  id: string;
  uniqueNumber: string;
  typeId: string;
  taxPayerId: string;
  description: string | null;
  parentId: string | null;
  organizationId: string;
  isVoucher: boolean;
  additionnalData: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
  updatedByUserId: string | null;
  createdByUserId: string | null;
  approvalStatus: string;
  isDeleted: boolean;
  meta: Record<string, unknown> | null;
  _count: {
    operations: number;
    recipes: number;
    operationPossessions: number;
  };
};

export type TaxpayerAccount = {
  id: string;
  fullName: string;
  mobile: string;
  uniqueId: string;
  userId: string | null;
  // photo: string | null;
  firstName: string;
  middleName: string | null;
  lastName: string;
  physicalAddress: string | null;
  originEntityId: string | null;
  email: string | null;
  organizationId: string | null;
  birthDate: string | null;
  birthPlace: string | null;
  martialStatus: string | null;
  currentEntityId: string | null;
  sex: string | null;
  category: string;
  identityCard: string | null;
  identityCardNumber: string | null;
  additionnalData: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
  updatedByUserId: string | null;
  createdByUserId: string;
  approvalStatus: string;
  isDeleted: boolean;
  user: {
    photo: string | null;
    mail: string | null;
  };
  meta: Record<string, unknown>;
  possessions: TaxpayerPossession[];
};

export type TaxpayerAccountResponse = {
  code: number;
  message: string;
  data: TaxpayerAccount;
};
