"use client";

import {
  requestPasswordReset,
  resetPassword,
  type ResetPasswordInput,
  type PasswordResetRequestResult,
  type ResetPasswordResult,
  validateResetToken,
  type ResetTokenValidationResult,
  type ApiError,
} from "@/services/authApi";
import {
  useMutation,
  useQuery,
  type UseMutationOptions,
  type UseQueryResult,
} from "@tanstack/react-query";

function shouldRetry(failureCount: number, error: unknown): boolean {
  if (failureCount >= 2) return false;
  const apiError = error as ApiError | undefined;
  if (apiError?.code && apiError.code >= 400 && apiError.code < 500) {
    return false;
  }
  return true;
}

export function useRequestPasswordReset(
  options?: UseMutationOptions<
    PasswordResetRequestResult,
    ApiError,
    string,
    unknown
  >
) {
  return useMutation<PasswordResetRequestResult, ApiError, string>({
    mutationFn: (mail: string) => requestPasswordReset(mail),
    retry: shouldRetry,
    ...options,
  });
}

export function useResetPassword(
  options?: UseMutationOptions<
    ResetPasswordResult,
    ApiError,
    ResetPasswordInput,
    unknown
  >
) {
  return useMutation<ResetPasswordResult, ApiError, ResetPasswordInput>({
    mutationFn: (payload) => resetPassword(payload),
    retry: shouldRetry,
    ...options,
  });
}

export function useValidateResetToken(
  token: string | null | undefined
): UseQueryResult<ResetTokenValidationResult, ApiError> {
  return useQuery<ResetTokenValidationResult, ApiError>({
    queryKey: ["reset-password-token", token],
    queryFn: () => validateResetToken(token ?? ""),
    enabled: Boolean(token),
    retry: shouldRetry,
    staleTime: 5 * 60 * 1000,
  });
}
