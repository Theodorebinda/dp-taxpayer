import { QueryClient } from "@tanstack/react-query";

const FIVE_MINUTES = 5 * 60 * 1000;

function redirectToLogin() {
  if (typeof window !== "undefined") {
    window.location.href = "/auth/login";
  }
}

let queryClient: QueryClient | undefined;

export function getQueryClient() {
  if (!queryClient) {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: (failureCount, error) => {
            const status =
              (error as { code?: number })?.code ??
              (error as { status?: number })?.status;
            if (status === 401) {
              // redirectToLogin();
              return false;
            }
            return failureCount < 2;
          },
          staleTime: FIVE_MINUTES,
          refetchOnWindowFocus: true,
          refetchOnReconnect: true,
        },
        mutations: {
          retry: 1,
          // Intercepter les erreurs
          onError: (error) => {
            if ((error as { isHandled?: boolean })?.isHandled) {
              return;
            }
          },
        },
      },
    });
  }
  return queryClient;
}
