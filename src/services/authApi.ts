"use client";

import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";

type ApiEnvelope<T> = {
  code?: number;
  message?: string;
  data?: T;
  meta?: unknown;
};

export type ApiError = Error & {
  code?: number;
  details?: unknown;
};

function unwrapData<T>(res: unknown): T | undefined {
  if (res && typeof res === "object") {
    const root = res as Partial<ApiEnvelope<unknown>> & { data?: unknown };
    if (typeof root.data !== "undefined") {
      const inner = root.data as { data?: unknown };
      if (inner && typeof inner === "object" && "data" in inner) {
        return (inner as { data: T }).data;
      }
      return root.data as T;
    }
  }
  return undefined;
}

function toApiError(fallbackMessage: string): ApiError {
  const baseError = (apiClient as unknown as { error?: ApiError })?.error;
  const error: ApiError = new Error(baseError?.message || fallbackMessage);
  error.code = baseError?.code ?? 500;
  error.details = baseError ?? fallbackMessage;
  return error;
}

export type PasswordResetRequestResult = {
  message: string;
  code?: number;
};

export async function requestPasswordReset(
  mail: string
): Promise<PasswordResetRequestResult> {
  const response = await apiClient.post<ApiEnvelope<Record<string, unknown>>>(
    API_ENDPOINTS.AUTH_PASSWORD_RESET_REQUEST,
    { mail }
  );
  if (!response) {
    throw toApiError(
      "Impossible d'envoyer le lien de réinitialisation. Merci de réessayer."
    );
  }
  const message =
    typeof response.message === "string" && response.message.trim().length > 0
      ? response.message
      : "Un lien de réinitialisation vous a été envoyé si le compte existe.";
  return {
    message,
    code: response.code,
  };
}

export type ResetPasswordInput = {
  token: string;
  newPassword: string;
};

export type ResetPasswordResult = {
  message: string;
};

export async function resetPassword(
  payload: ResetPasswordInput
): Promise<ResetPasswordResult> {
  const response = await apiClient.post<ApiEnvelope<Record<string, unknown>>>(
    API_ENDPOINTS.AUTH_PASSWORD_UPDATE,
    payload
  );
  if (!response) {
    throw toApiError(
      "Impossible de réinitialiser le mot de passe. Merci de réessayer."
    );
  }
  const message =
    typeof response.message === "string" && response.message.trim().length > 0
      ? response.message
      : "Votre mot de passe a été mis à jour.";
  return { message };
}

export type ResetTokenValidationResult = {
  valid: boolean;
  email?: string;
  expiresAt?: string;
  message?: string;
};

export async function validateResetToken(
  token: string
): Promise<ResetTokenValidationResult> {
  const response = await apiClient.get<ApiEnvelope<ResetTokenValidationResult>>(
    API_ENDPOINTS.AUTH_VALIDATE_RESET_TOKEN(token)
  );
  if (!response) {
    throw toApiError("Impossible de valider votre lien de réinitialisation.");
  }
  const data = unwrapData<ResetTokenValidationResult>(response) ?? {
    valid: true,
  };
  return {
    valid: typeof data.valid === "boolean" ? data.valid : true,
    email: data.email,
    expiresAt: data.expiresAt,
    message:
      typeof response.message === "string" && response.message.trim().length > 0
        ? response.message
        : data.message,
  };
}
