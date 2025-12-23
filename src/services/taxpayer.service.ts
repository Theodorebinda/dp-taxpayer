import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { ApiInputType } from "@/types/types";
import type { TaxpayerAccount } from "@/types/taxpayer-account.type";

type ApiWrapper<T> = {
  code: number;
  message: string;
  data: T;
  meta?: unknown;
  form?: unknown;
};

type ApiLikePayload = {
  message?: string;
  form?: unknown;
  data?: unknown;
};

function unwrapData<T>(res: unknown): T {
  if (res && typeof res === "object") {
    const r = res as Partial<ApiWrapper<unknown>> & { data?: unknown };
    if (typeof r.data !== "undefined") {
      // data peut contenir { data: T }
      const inner = r.data as { data?: unknown };
      if (inner && typeof inner === "object" && "data" in inner) {
        return (inner as { data: T }).data as T;
      }
      return r.data as T;
    }
  }
  return res as T;
}

function extractForm(payload: unknown): Record<string, unknown> | null {
  if (!payload || typeof payload !== "object") return null;
  const record = payload as Record<string, unknown>;

  if ("form" in record) {
    const maybeForm = record["form"];
    if (maybeForm && typeof maybeForm === "object") {
      return maybeForm as Record<string, unknown>;
    }
  }

  if ("data" in record) {
    return extractForm(record["data"]);
  }

  return null;
}

export type RegistrationFieldsPayload = {
  fields: ApiInputType[];
  form: Record<string, unknown> | null;
  message?: string;
};

export async function getRegistrationFields(): Promise<
  RegistrationFieldsPayload | false
> {
  const res = await apiClient.get<ApiInputType[] | { data: ApiInputType[] }>(
    API_ENDPOINTS.TAXPAYER_REGISTRATION
  );

  if (!res) return false;

  const payload = unwrapData<ApiInputType[]>(res) ?? [];
  const meta = res as ApiLikePayload;
  const form = extractForm(res) ?? null;

  return {
    fields: payload,
    form,
    message:
      typeof meta.message === "string" && meta.message.trim().length > 0
        ? meta.message
        : undefined,
  };
}

export async function registerTaxpayer(
  payload: Record<string, unknown>
): Promise<{ data: Record<string, unknown> } | false> {
  const res = await apiClient.post<Record<string, unknown>>(
    API_ENDPOINTS.TAXPAYER_REGISTRATION,
    payload
  );

  if (!res) return false;
  const data = unwrapData<Record<string, unknown>>(res);
  return { data };
}

/**
 * Récupère les informations complètes d'un contribuable par son ID
 * @param id - ID du contribuable
 * @param accessToken - Token d'accès NextAuth (optionnel, pour appels serveur)
 * @param paginationParams - Paramètres de pagination (skip, limit)
 * @returns Les données du contribuable ou false en cas d'erreur
 */
export async function getTaxpayerById(
  id: string,
  accessToken?: string,
  paginationParams?: { skip?: number; limit?: number }
): Promise<TaxpayerAccount | false> {
  let endpoint = API_ENDPOINTS.TAXPAYER_ACCOUNT(id);

  if (paginationParams) {
    const params = new URLSearchParams();
    if (paginationParams.skip !== undefined) {
      params.append("skip", String(paginationParams.skip));
    }
    if (paginationParams.limit !== undefined) {
      params.append("limit", String(paginationParams.limit));
    }
    const queryString = params.toString();
    if (queryString) {
      endpoint = `${endpoint}?${queryString}`;
    }
  }

  const res = await apiClient.get<TaxpayerAccount>(
    endpoint,
    undefined,
    accessToken
  );
  if (!res) return false;
  // res est maintenant de type { code, message, data: TaxpayerAccount, ... } (pas false)
  const accountData = res.data;
  if (!accountData) return false;
  return accountData;
}

/**
 * Met à jour les informations d'un contribuable
 * @param id - ID du contribuable
 * @param payload - Données à mettre à jour
 * @param accessToken - Token d'accès NextAuth (optionnel, pour appels serveur)
 * @returns Les données mises à jour ou false en cas d'erreur
 */
export async function updateTaxpayer(
  id: string,
  payload: Record<string, unknown> | FormData,
  accessToken?: string
): Promise<{ data: Record<string, unknown>; message?: string } | false> {
  const res = await apiClient.patch<Record<string, unknown>>(
    API_ENDPOINTS.UPDATE_TAXPAYER(id),
    payload,
    undefined,
    accessToken
  );

  console.log("res", res);
  console.log("payload", payload);
  console.log("accessToken", accessToken);
  console.log("id", id);
  if (!res) return false;
  const data = unwrapData<Record<string, unknown>>(res);
  const message =
    typeof res.message === "string" && res.message.trim().length > 0
      ? res.message
      : undefined;
  return { data, message };
}
