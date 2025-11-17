import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { ApplicationType, SideMenuType } from "@/types/application.type";

type ApiWrapper<T> = {
  code: number;
  message: string;
  data: T;
  meta?: unknown;
};

export type ApiError = Error & {
  code?: number;
  details?: unknown;
};

function unwrapData<T>(res: unknown): T {
  if (res && typeof res === "object") {
    const root = res as Partial<ApiWrapper<unknown>> & { data?: unknown };
    if (typeof root.data !== "undefined") {
      const inner = root.data as { data?: unknown };
      if (inner && typeof inner === "object" && "data" in inner) {
        return (inner as { data: T }).data;
      }
      return root.data as T;
    }
  }
  return res as T;
}

function toApiError(fallbackMessage: string): ApiError {
  const baseError = (apiClient as unknown as { error?: ApiError })?.error;
  const error: ApiError = new Error(baseError?.message || fallbackMessage);
  error.code = baseError?.code ?? 500;
  error.details = baseError ?? fallbackMessage;
  return error;
}

export async function getApplications(): Promise<ApplicationType[]> {
  const response = await apiClient.get<{ data: ApplicationType[] }>(
    API_ENDPOINTS.APPLICATIONS
  );
  if (!response) {
    throw toApiError("Impossible de charger les applications.");
  }
  return unwrapData<ApplicationType[]>(response) ?? [];
}

export async function getApplicationMenus(
  applicationId: string
): Promise<SideMenuType[]> {
  const response = await apiClient.get<{ data: SideMenuType[] }>(
    API_ENDPOINTS.APPLICATION_MENUS(applicationId)
  );
  if (!response) {
    throw toApiError("Impossible de charger les menus de l'application.");
  }
  return unwrapData<SideMenuType[]>(response) ?? [];
}

export async function markMenuVisited(menuId: string) {
  const response = await apiClient.post(API_ENDPOINTS.MENU_VISITS(menuId), {});
  if (!response) {
    throw toApiError("Impossible de mettre à jour le menu.");
  }
  return response;
}
