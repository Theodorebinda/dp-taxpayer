"use client";

import { getQueryClient } from "@/lib/cache/query-client";
import { uiStore } from "@/store/ui-store";
import { applictionsStore } from "@/store/applications";
import { connectedUserStore } from "@/store/connectedUser";
import { currentMenuStore } from "@/store/currentMenu";
import { useFormStore } from "@/store/form.store";
import { formValueStore } from "@/store/form_value.store";

type ResetFn = () => void;

const zustandResetters: ResetFn[] = [
  () =>
    uiStore.setState({
      displayLayout: "grid",
      isSidebarOpen: true,
      isOpen: true,
      sidebarWidth: 320,
    }),
  () =>
    applictionsStore.setState({
      displayLayout: "list",
      applications: [],
      currentApplication: null,
      isLoading: true,
      error: undefined,
    }),
  () => connectedUserStore.setState({ user: null }),
  () => currentMenuStore.setState({ menus: [] }),
  () => useFormStore.setState({ fields: {} }),
  () => formValueStore.setState({ value: {} }),
];

function clearBrowserStorage() {
  if (typeof window === "undefined") return;
  const localStorageKeys = [
    "dp-sk-moto-user",
    "dp-sk-moto-token",
    "nextauth.message",
  ];
  const sessionStorageKeys = ["dp-session-token"];

  localStorageKeys.forEach((key) => {
    window.localStorage.removeItem(key);
  });
  sessionStorageKeys.forEach((key) => {
    window.sessionStorage.removeItem(key);
  });
}

async function resetReactQueryCache() {
  const client = getQueryClient();
  try {
    await client.cancelQueries();
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("[logout] Impossible d'annuler les requêtes", error);
    }
  }
  client.clear();
}

export async function resetClientState(): Promise<void> {
  zustandResetters.forEach((reset) => {
    try {
      reset();
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        console.error("[logout] Erreur lors du reset d'un store", error);
      }
    }
  });

  await resetReactQueryCache();
  clearBrowserStorage();
}
