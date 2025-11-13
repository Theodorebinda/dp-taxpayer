import HttpClient from "@/utils/http-client";

export function createApiClient() {
  return new HttpClient();
}

export const apiClient = createApiClient();
