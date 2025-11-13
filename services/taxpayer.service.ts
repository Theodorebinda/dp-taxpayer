import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { ApiInputType } from "@/types/types";

export async function getRegistrationFields() {
  return apiClient.get<{ data: ApiInputType[] }>(
    API_ENDPOINTS.TAXPAYER_REGISTRATION
  );
}

export async function registerTaxpayer(payload: Record<string, any>) {
  return apiClient.post<Record<string, any>>(
    API_ENDPOINTS.TAXPAYER_REGISTRATION,
    payload
  );
}


