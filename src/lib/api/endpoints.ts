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
  AUTH_OTP_SEND: (method: string) => `/auth/otp?method=${method}`,
  AUTH_OTP_VALIDATION: "/auth/otp/validation",
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
  UPDATE_DECLARATION: (type: string, id: string | number) =>
    `/declarations/${type}/${id}`,
  GET_DECLARATION: (type: string, id: string | number) =>
    `/declarations/${type}/${id}`,
  DECLARABLE_RECIPES: "/search/recipe/recipe/declarable",
  RECIPE_FORM: (recipeId: string) => `/list/recipe/recipe/${recipeId}/forms`,
  CREATE_RECIPE_DECLARATION: (recipeId: string) =>
    `/list/recipe/recipe/${recipeId}/declarations`,
} as const;
