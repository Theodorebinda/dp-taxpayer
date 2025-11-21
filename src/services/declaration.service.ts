import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { ApiInputType } from "@/types/types";
import type { DeclarationType } from "@/types/declaration-types";

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

export type DeclarationFormFieldsPayload = {
  fields: ApiInputType[];
  form: Record<string, unknown> | null;
  message?: string;
};

/**
 * Récupère les champs de formulaire pour un type de déclaration donné
 * @param type - Type de déclaration
 * @param accessToken - Token d'accès NextAuth (optionnel, pour appels serveur)
 * @returns Les champs du formulaire ou false en cas d'erreur
 */
export async function getDeclarationFormFields(
  type: DeclarationType,
  accessToken?: string
): Promise<DeclarationFormFieldsPayload | false> {
  const res = await apiClient.get<ApiInputType[] | { data: ApiInputType[] }>(
    API_ENDPOINTS.DECLARATION_FORM(type),
    undefined,
    accessToken
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

/**
 * Soumet une nouvelle déclaration
 * @param type - Type de déclaration
 * @param payload - Données du formulaire
 * @param accessToken - Token d'accès NextAuth (optionnel, pour appels serveur)
 * @returns Les données créées ou false en cas d'erreur
 */
export async function createDeclaration(
  type: DeclarationType,
  payload: Record<string, unknown>,
  accessToken?: string
): Promise<{ data: Record<string, unknown>; message?: string } | false> {
  const res = await apiClient.post<Record<string, unknown>>(
    API_ENDPOINTS.CREATE_DECLARATION(type),
    payload,
    undefined,
    accessToken
  );
  if (!res) return false;
  const data = unwrapData<Record<string, unknown>>(res);
  const message =
    typeof res.message === "string" && res.message.trim().length > 0
      ? res.message
      : undefined;
  return { data, message };
}

/**
 * Met à jour une déclaration existante
 * @param type - Type de déclaration
 * @param id - ID de la déclaration
 * @param payload - Données du formulaire
 * @param accessToken - Token d'accès NextAuth (optionnel, pour appels serveur)
 * @returns Les données mises à jour ou false en cas d'erreur
 */
export async function updateDeclaration(
  type: DeclarationType,
  id: string | number,
  payload: Record<string, unknown>,
  accessToken?: string
): Promise<{ data: Record<string, unknown>; message?: string } | false> {
  const res = await apiClient.patch<Record<string, unknown>>(
    API_ENDPOINTS.UPDATE_DECLARATION(type, id),
    payload,
    undefined,
    accessToken
  );
  if (!res) return false;
  const data = unwrapData<Record<string, unknown>>(res);
  const message =
    typeof res.message === "string" && res.message.trim().length > 0
      ? res.message
      : undefined;
  return { data, message };
}

/**
 * Récupère une déclaration existante
 * @param type - Type de déclaration
 * @param id - ID de la déclaration
 * @param accessToken - Token d'accès NextAuth (optionnel, pour appels serveur)
 * @returns Les données de la déclaration ou false en cas d'erreur
 */
export async function getDeclaration(
  type: DeclarationType,
  id: string | number,
  accessToken?: string
): Promise<
  { data: Record<string, unknown>; form?: Record<string, unknown> } | false
> {
  const res = await apiClient.get<Record<string, unknown>>(
    API_ENDPOINTS.GET_DECLARATION(type, id),
    undefined,
    accessToken
  );
  if (!res) return false;
  const data = unwrapData<Record<string, unknown>>(res);
  const form = extractForm(res);
  return { data, form: form || undefined };
}
