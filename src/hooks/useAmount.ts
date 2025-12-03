import { useApiQuery } from "./useApi";
import { apiClient } from "@/lib/api/client";
import { qk } from "@/utils/query-keys";

/**
 * Hook TanStack Query pour récupérer le montant total à payer
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

export interface AmountResponse {
  amount: number;
  currency: string;
  operationId?: string;
}

export function useAmount(operationId?: string) {
  return useApiQuery<AmountResponse>(
    qk.payment.amount(operationId),
    async () => {
      // TODO: Remplacer par l'endpoint réel de l'API
      const endpoint = operationId
        ? `/payments/amount?operationId=${operationId}`
        : "/payments/amount";

      const response = await apiClient.get<AmountResponse>(endpoint);

      if (!response) {
        throw new Error("Impossible de récupérer le montant");
      }

      return unwrapData<AmountResponse>(response);
    },
    {
      enabled: true, // Toujours activé, même sans operationId
      staleTime: 2 * 60 * 1000, // 2 minutes
      refetchOnWindowFocus: false,
    }
  );
}
