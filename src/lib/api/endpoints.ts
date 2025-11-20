export const API_ENDPOINTS = {
  TAXPAYER_REGISTRATION: "/taxpayer/registration",
  AUTH_LOGIN: "/auth/login",
  AUTH_PASSWORD_FORGOT: "/auth/password/forgot",
  AUTH_REFRESH: "/auth/refresh",
  AUTH_ME: "/auth/me",
  AUTH_PASSWORD_RESET_REQUEST: "/auth/password_reset",
  AUTH_PASSWORD_UPDATE: "/change/auth/password",
  AUTH_VALIDATE_RESET_TOKEN: (token: string) =>
    `/auth/reset-token-validation/${token}`,
  APPLICATIONS: "/load/app",
  APPLICATION_MENUS: (applicationId: string) =>
    `/applications/${applicationId}/menu`,
  MENU_VISITS: (menuId: string) => `/menu/${menuId}/visit`,
  MENU: "/menu",
  VIEWS: (id: string | number) => `/views/${id}`,
  OPERATIONS: "/operations",
  TAXPAYER_ACCOUNT: (id: string) => `/read/taxpayer/${id}/account`,
  DECLARATION_FORM: (type: string) => `/declarations/${type}/form`,
  CREATE_DECLARATION: (type: string) => `/declarations/${type}`,
} as const;
