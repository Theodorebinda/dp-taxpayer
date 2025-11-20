export interface User {
  id: string;
  name: string;
  mail: string;
  mobile: string;
  photo: null;
  isRoot: boolean;
  isActive: boolean;
  isStaff: boolean;
  mustRenewPassword: boolean;
  allowedDeviceNumber: number;
  type: string;
  isTwoFactorEnable: boolean;
  roleId: null;
  organizationId: null;
  createdAt: Date;
  updatedAt: Date;
  updatedByUserId: string;
  createdByUserId: null;
  approvalStatus: string;
  isDeleted: boolean;
  meta: Record<string, unknown>;
  _count: Count;
  userDevices: Record<string, unknown>[];
  agent: null;
  taxPayer: TaxPayer;
  role: any[];
}

export interface Count {
  userDevices: number;
}

export interface UserMeta {
  logs: Logs;
}

export interface Logs {
  "2025": The2025;
}

export interface The2025 {
  "11": string[];
}

export interface TaxPayer {
  id: string;
  fullName: string;
  mobile: string;
  uniqueId: string;
  userId: string;
  firstName: string;
  middleName: string;
  lastName: string;
  physicalAddress: string;
  originEntityId: string;
  email: string;
  organizationId: string;
  birthDate: string;
  birthPlace: string;
  martialStatus: string;
  currentEntityId: string;
  sex: string;
  category: string;
  identityCard: string;
  identityCardNumber: string;
  additionnalData: null;
  createdAt: Date;
  updatedAt: Date;
  updatedByUserId: null;
  createdByUserId: null;
  approvalStatus: string;
  isDeleted: boolean;
  meta: Record<string, unknown>; // Pour des données supplémentaires non spécifiées;
  organization: Organization;
  possessions: any[];
  originEntity: OriginEntity;
  types: any[];
  user: UserClass;
}

export interface Organization {
  id: string;
  name: string;
  photo: string;
  walletId: string;
  parentId: null;
  active: boolean;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
  updatedByUserId: string;
  createdByUserId: null;
  approvalStatus: string;
  isDeleted: boolean;
  meta: OrganizationMeta;
}

export interface OrganizationMeta {
  active: boolean;
  models: null[];
  parentId: null;
  walletId: string;
  createdAt: Date;
  isDeleted: boolean;
  updatedAt: Date;
  applications: string[];
  approvalStatus: string;
  updatedByUserId: string;
}

export interface OriginEntity {
  id: string;
  name: string;
  description: string;
  abbreviation: string;
  parentId: null;
  namedEntity: string;
  organizationId: null;
  postalCode: null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  updatedByUserId: null;
  createdByUserId: null;
  approvalStatus: string;
  isDeleted: boolean;
  meta: Record<string, unknown>;
}

export interface UserClass {
  mail: string;
  mobile: string;
}
