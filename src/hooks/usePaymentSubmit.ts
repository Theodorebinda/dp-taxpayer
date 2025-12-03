import { useApiMutation } from "./useApi";
import { apiClient } from "@/lib/api/client";

/**
 * Hook TanStack Query pour soumettre un paiement EasyPay
 */

function unwrapData<T>(res: unknown): T {
  if (res && typeof res === "object") {
    const r = res as { data?: unknown };
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

export interface PaymentSubmitPayload {
  method: "easypay";
  fullName: string;
  email: string;
  phone: string;
  amount: number;
  operationId?: string;
}

export interface PaymentSubmitResponse {
  success: boolean;
  transactionId?: string;
  message?: string;
}

export function usePaymentSubmit() {
  return useApiMutation<PaymentSubmitPayload, PaymentSubmitResponse>(
    async (payload) => {
      // TODO: Remplacer par l'endpoint réel de l'API
      const response = await apiClient.post<PaymentSubmitResponse>(
        "/payments/easypay",
        payload as unknown as Record<string, unknown>
      );

      if (!response) {
        throw new Error("Échec de la soumission du paiement");
      }

      return unwrapData<PaymentSubmitResponse>(response);
    },
    {
      retry: 1,
    }
  );
}
