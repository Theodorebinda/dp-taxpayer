export const API_ENDPOINTS = {
  TAXPAYER_REGISTRATION: "/taxpayer/registration",
  AUTH_LOGIN: "/auth/login",
  AUTH_REFRESH: "/auth/refresh",
  AUTH_ME: "/auth/me",
  APPLICATIONS: "/load/app",
  APPLICATION_MENUS: (applicationId: string) =>
    `/applications/${applicationId}/menu`,
  MENU_VISITS: (menuId: string) => `/menu/${menuId}/visit`,
  MENU: "/menu",
  VIEWS: (id: string | number) => `/views/${id}`,
  OPERATIONS: "/operations",
} as const;
