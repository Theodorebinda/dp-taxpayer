"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useToast } from "@/hooks/useToast";
import { isPublicPath } from "@/lib/auth/public-paths";

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
  const { error } = useToast();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const tokenExists = hasAccessToken();
    const isPublicRoute = isPublicPath(pathname ?? "/");

    if (tokenExists && isPublicRoute) {
      router.replace("/dashboard");
      return;
    }

    if (!tokenExists && !isPublicRoute) {
      error("Votre session a expiré. Merci de vous reconnecter.");
      router.replace("/");
    }
  }, [pathname, router, error]);

  return null;
}
