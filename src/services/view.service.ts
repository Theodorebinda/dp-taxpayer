import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";

export type DynamicView = {
  id: string;
  title?: string;
  tabs?: { id: string; label: string; viewId?: string }[];
  table?: {
    columns: Array<{ key: string; label: string }>;
    rows: Array<Record<string, unknown>>;
  };
  form?: Record<string, unknown>;
  [key: string]: unknown;
};

export async function getView(
  id: string | number,
  accessToken?: string
): Promise<DynamicView | null> {
  const res = await apiClient.get<{ data: DynamicView }>(
    API_ENDPOINTS.VIEWS(String(id)),
    undefined,
    accessToken
  );
  if (!res) return null;
  const fromWrapper = (res.data as unknown as { data?: unknown })?.data;
  const data = (
    typeof fromWrapper !== "undefined" ? fromWrapper : (res.data as unknown)
  ) as unknown;
  return (data as DynamicView) ?? null;
}
