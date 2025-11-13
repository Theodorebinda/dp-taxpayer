import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";

export type LoginPayload = { username: string; password: string };
export type LoginResult = {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: {
    id: string;
    email?: string;
    name?: string;
    roles?: string[];
    [k: string]: unknown;
  };
};

export async function login(payload: LoginPayload): Promise<LoginResult> {
  const res = await apiClient.post<LoginResult>(
    API_ENDPOINTS.AUTH_LOGIN,
    payload
  );
  if (!res) throw new Error("Échec de connexion");
  return res.data as unknown as LoginResult;
}

export async function refresh(
  refreshToken: string
): Promise<{ accessToken: string; expiresIn: number }> {
  const res = await apiClient.post<{ accessToken: string; expiresIn: number }>(
    API_ENDPOINTS.AUTH_REFRESH,
    { refreshToken }
  );
  if (!res) throw new Error("Refresh token invalide");
  return res.data as unknown as { accessToken: string; expiresIn: number };
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
