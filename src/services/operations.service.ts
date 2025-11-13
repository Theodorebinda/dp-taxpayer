import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";

export async function listOperations(
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
  const res = await apiClient.get<{ data: unknown[] }>(
    `${API_ENDPOINTS.OPERATIONS}${query}`,
    undefined,
    accessToken
  );
  if (!res) return [];
  const fromWrapper = (res.data as unknown as { data?: unknown })?.data;
  const data = (
    typeof fromWrapper !== "undefined" ? fromWrapper : (res.data as unknown)
  ) as unknown;
  return (data as unknown[]) ?? [];
}
