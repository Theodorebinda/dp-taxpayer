import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";

export type MenuItem = {
  id: string;
  label: string;
  path?: string;
  icon?: string;
  children?: MenuItem[];
  [key: string]: unknown;
};

export async function getMenus(accessToken?: string): Promise<MenuItem[]> {
  const res = await apiClient.get<{ data: MenuItem[] }>(
    API_ENDPOINTS.MENU,
    undefined,
    accessToken
  );
  if (!res) return [];
  const fromWrapper = (res.data as unknown as { data?: unknown })?.data;
  const data = (
    typeof fromWrapper !== "undefined" ? fromWrapper : (res.data as unknown)
  ) as unknown;
  return (data as MenuItem[]) ?? [];
}
