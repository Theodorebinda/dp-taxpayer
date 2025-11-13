interface UserDevice {
  id: string;
  deviceInnerId: string | null;
  userId: string | null;
  deviceType: string | null;
  os: string | null;
  browser: string | null;
  ip: string | null;
  createdAt: string | null;
  otp: number;
  otpExpireAt: string | null;
  isActive: boolean;
}

interface Meta {
  logs: Record<string, any>;
}

interface UserData {
  id: string;
  name: string | null;
  mail: string | null;
  mobile: string | null;
  isRoot: boolean | null;
  isActive: boolean | null;
  isStaff: boolean | null;
  mustRenewPassword: boolean;
  allowedDeviceNumber: number;
  roleId: null | string;
  createdAt: string;
  updatedAt: string;
  updatedByUserId: string | null;
  createdByUserId: string | null;
  isDeleted: boolean;
  meta: Meta;
  _count: {
    userDevices: number;
  };
  userDevices: UserDevice[];
  agent: null | any;
  role: null | any;
}

export type ApiResponse =
  | {
      code: number;
      message: string;
      redirectToOpt: boolean;
      data: UserData;
      access_token: string;
    }
  | {
      code: 200;
      message: string;
      redirectToOpt: boolean;
      otpMethod: {
        name: string;
        value: string;
      }[];
      token: string;
    };
