import { useMemo } from "react";
import { useSession } from "next-auth/react";
import { useApiQuery } from "@/hooks/useApi";
import HttpClient from "@/utils/http-client";
import type { ApiInputType, InputOption } from "@/types/types";

const apiClient = new HttpClient();

type RemoteOptionsResponse = {
  data?: unknown;
  items?: unknown;
};

function toInputOption(value: unknown): InputOption | null {
  if (typeof value === "string" || typeof value === "number") {
    return { label: String(value), value: String(value) };
  }

  if (value && typeof value === "object") {
    const option = value as Partial<InputOption> & {
      label?: string;
      value?: unknown;
    };

    const normalizedValue = option.value ?? option.label ?? null;

    if (normalizedValue === null || typeof normalizedValue === "undefined") {
      return null;
    }

    return {
      ...option,
      label: option.label ?? String(normalizedValue),
      value: String(normalizedValue),
    } as InputOption;
  }

  return null;
}

function extractOptions(payload: unknown): InputOption[] {
  if (Array.isArray(payload)) {
    return payload.map(toInputOption).filter(Boolean) as InputOption[];
  }

  if (payload && typeof payload === "object") {
    const record = payload as RemoteOptionsResponse & Record<string, unknown>;

    if (record.data) {
      return extractOptions(record.data);
    }

    if (record.items) {
      return extractOptions(record.items);
    }

    // Chercher la première propriété tableau disponible
    for (const key of Object.keys(record)) {
      const value = record[key];
      if (Array.isArray(value)) {
        return extractOptions(value);
      }
    }
  }

  return [];
}

export function useSelectOptions(
  field: ApiInputType | undefined,
  searchTerm: string
) {
  const endpoint = field?.endpoint ?? null;
  const { data: session } = useSession();
  const accessToken = useMemo(() => {
    const token = (session as { accessToken?: string } | null)?.accessToken;
    return typeof token === "string" ? token : undefined;
  }, [session]);

  const queryKey = useMemo(() => {
    if (!field || !endpoint) return null;
    return ["select-options", field.property, endpoint, searchTerm];
  }, [endpoint, field, searchTerm]);

  const query = useApiQuery(
    queryKey ?? [],
    async () => {
      if (!endpoint) return [] as InputOption[];

      const endpointWithQuery =
        searchTerm && searchTerm.trim().length > 0
          ? `${endpoint}${
              endpoint.includes("?") ? "&" : "?"
            }search_term=${encodeURIComponent(searchTerm.trim())}`
          : endpoint;

      const response = await apiClient.get<
        RemoteOptionsResponse | InputOption[] | null
      >(endpointWithQuery, undefined, accessToken);

      if (process.env.NODE_ENV !== "production") {
        console.debug(
          "[useSelectOptions] fetch",
          field?.property,
          endpointWithQuery,
          response
        );
      }

      return extractOptions(response ?? []);
    },
    {
      enabled: Boolean(queryKey && endpoint && accessToken),
    }
  );

  return {
    options: query.data,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error,
  } as const;
}
