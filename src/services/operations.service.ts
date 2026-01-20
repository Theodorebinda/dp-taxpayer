import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type { OperationView } from "@/types/operation-view.type";

export async function listOperations(
  taxpayerId: string,
  params?: Record<string, unknown>,
  accessToken?: string
) {
  const query = params
    ? `?${new URLSearchParams(
        Object.fromEntries(
          Object.entries(params).map(([k, v]) => [k, String(v)])
        )
      ).toString()}`
    : "";
  const res = await apiClient.get<{ data: OperationView[] }>(
    `${API_ENDPOINTS.OPERATIONS(taxpayerId)}${query}`,
    undefined,
    accessToken
  );

  console.log({res})
  if (!res) return [];
  const fromWrapper = (res.data as unknown as { data?: unknown })?.data;
  const data = (
    typeof fromWrapper !== "undefined" ? fromWrapper : (res.data as unknown)
  ) as unknown;
  return (data as OperationView[]) ?? [];
}
