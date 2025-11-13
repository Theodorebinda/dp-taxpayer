import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { ApiInputType } from "@/types/types";

type ApiWrapper<T> = {
  code: number;
  message: string;
  data: T;
  meta?: unknown;
  form?: unknown;
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

export async function getRegistrationFields(): Promise<
  { data: ApiInputType[] } | false
> {
  const res = await apiClient.get<{ data: ApiInputType[] }>(
    API_ENDPOINTS.TAXPAYER_REGISTRATION
  );
  if (!res) return false;
  const payload = unwrapData<ApiInputType[]>(res);
  return { data: payload };
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
