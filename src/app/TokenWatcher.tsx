"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useToast } from "@/hooks/useToast";

const PUBLIC_PATHS = new Set<string>([
  "/",
  "/auth/login",
  "/auth/registration",
  "/registration",
]);

function hasAccessToken(): boolean {
  if (typeof window === "undefined") return false;
  const session = window.localStorage.getItem("nextauth.message");
  return (
    !!session ||
    !!window.localStorage.getItem("dp-sk-moto-token") ||
    !!window.sessionStorage.getItem("dp-session-token")
  );
}

export default function TokenWatcher() {
  const router = useRouter();
  const pathname = usePathname();
  const { info, error } = useToast();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const tokenExists = hasAccessToken();
    const isPublicRoute = PUBLIC_PATHS.has(pathname ?? "");

    if (tokenExists && isPublicRoute) {
      router.replace("/dashboard");
      return;
    }

    if (!tokenExists && !isPublicRoute) {
      error("Votre session a expiré. Merci de vous reconnecter.");
      router.replace("/auth/login");
    }
  }, [pathname, router, error]);

  return null;
}
