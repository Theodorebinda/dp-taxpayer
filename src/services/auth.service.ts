import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";

const LOGIN_APP =
  process.env.NEXT_PUBLIC_LOGIN_APP ??
  process.env.NEXT_PUBLIC_APP_ID ??
  "web.admin";
const LOGIN_OS = process.env.NEXT_PUBLIC_LOGIN_OS ?? "linux";
const LOGIN_VERSION =
  process.env.NEXT_PUBLIC_LOGIN_VERSION ??
  process.env.NEXT_PUBLIC_APP_VERSION ??
  "v0.2.16";
const LOGIN_IMEI =
  typeof process.env.NEXT_PUBLIC_LOGIN_IMEI !== "undefined"
    ? process.env.NEXT_PUBLIC_LOGIN_IMEI
    : null;

export type BackendLoginUser = {
  id: string;
  name?: string | null;
  mail?: string | null;
  mobile?: string | null;
  photo?: string | null;
  role?: unknown[];
  [k: string]: unknown;
};

export type LoginPayload = {
  identifier: string;
  password: string;
  app?: string;
  os?: string;
  IMEI?: string | null;
  version?: string;
};

export type LoginResponse = {
  code: number;
  message: string;
  redirectToOpt?: boolean;
  data: BackendLoginUser;
  access_token: string;
  refresh_token?: string | null;
  expiresIn?: number;
};

type RefreshResponse = {
  access_token?: string;
  accessToken?: string;
  expiresIn?: number;
  data?: RefreshResponse;
};

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  const body = {
    identifier: payload.identifier,
    password: payload.password,
    app: payload.app ?? LOGIN_APP,
    os: payload.os ?? LOGIN_OS,
    IMEI: payload.IMEI ?? LOGIN_IMEI,
    version: payload.version ?? LOGIN_VERSION,
  };

  const res = await apiClient.post<LoginResponse>(
    API_ENDPOINTS.AUTH_LOGIN,
    body
  );
  if (!res) throw new Error("Échec de connexion");
  return res as unknown as LoginResponse;
}

function extractAccessToken(
  payload: RefreshResponse | undefined
): string | null {
  if (!payload || typeof payload !== "object") return null;
  if (typeof payload.access_token === "string") return payload.access_token;
  if (typeof payload.accessToken === "string") return payload.accessToken;
  if (payload.data && typeof payload.data === "object") {
    return extractAccessToken(payload.data as RefreshResponse);
  }
  return null;
}

function extractExpiresIn(payload: RefreshResponse | undefined): number | null {
  if (!payload || typeof payload !== "object") return null;
  if (typeof payload.expiresIn === "number") return payload.expiresIn;
  if (payload.data && typeof payload.data === "object") {
    return extractExpiresIn(payload.data as RefreshResponse);
  }
  return null;
}

export type RefreshResult = {
  accessToken: string;
  expiresIn?: number | null;
};

export async function refresh(refreshToken: string): Promise<RefreshResult> {
  const res = await apiClient.post<RefreshResponse>(
    API_ENDPOINTS.AUTH_REFRESH,
    { refreshToken }
  );
  if (!res) throw new Error("Refresh token invalide");
  const payload = res as RefreshResponse;
  const accessToken = extractAccessToken(payload);
  if (!accessToken) throw new Error("Refresh token invalide");
  const expiresIn = extractExpiresIn(payload);
  return {
    accessToken,
    expiresIn,
  };
}

export async function me(
  accessToken?: string
): Promise<Record<string, unknown>> {
  const res = await apiClient.get<Record<string, unknown>>(
    API_ENDPOINTS.AUTH_ME,
    undefined,
    accessToken
  );
  if (!res) throw new Error("Impossible de charger le profil");
  return (res.data as unknown as Record<string, unknown>) ?? {};
}
