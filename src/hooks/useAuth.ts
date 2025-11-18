"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import type { Session } from "next-auth";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { resetClientState } from "@/lib/logout/reset-client-state";

type LoginInput = { identifier: string; password: string };
type LoginResult =
  | { ok: true; message?: string }
  | { ok: false; error?: string };

type UseAuthReturn = {
  loading: boolean;
  logoutLoading: boolean;
  isAuthenticated: boolean;
  session: Session | null;
  login: (input: LoginInput) => Promise<LoginResult>;
  logout: () => Promise<void>;
};

export function useAuth(): UseAuthReturn {
  const router = useRouter();
  const { data: session, status, update } = useSession();
  const [loading, setLoading] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const isAuthenticated =
    status === "authenticated" &&
    !!(session as unknown as Record<string, unknown> | null)?.accessToken;

  useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      console.info("[useAuth] Session status:", {
        status,
        hasAccessToken: Boolean(
          (session as unknown as Record<string, unknown> | null)?.accessToken
        ),
      });
    }
  }, [session, status]);

  async function login(input: LoginInput): Promise<LoginResult> {
    setLoading(true);
    try {
      if (process.env.NODE_ENV !== "production") {
        console.info("[useAuth] Attempting login", {
          identifier: input.identifier,
        });
      }
      const res = await signIn("credentials", {
        ...input,
        redirect: false,
      });
      if (!res) {
        throw new Error("Réponse d'authentification invalide.");
      }
      if (process.env.NODE_ENV !== "production") {
        console.info("[useAuth] signIn response:", res);
      }
      if (res?.error) throw new Error(res.error);
      await update();
      return { ok: true, message: "Connexion réussie" };
    } catch (e: unknown) {
      const err = e as { message?: string };
      if (process.env.NODE_ENV !== "production") {
        console.error("[useAuth] Login error:", err);
      }
      return { ok: false, error: err?.message || "Erreur de connexion" };
    } finally {
      setLoading(false);
    }
  }

  async function logout(): Promise<void> {
    setLogoutLoading(true);
    try {
      await resetClientState();
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        console.error("[useAuth] Reset client state error:", error);
      }
    }

    try {
      const response = await signOut({
        redirect: false,
        callbackUrl: "/",
      });
      const nextUrl = resolveCallbackUrl(
        (response as { url?: string } | undefined)?.url
      );
      router.replace(nextUrl);
      router.refresh();
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        console.error("[useAuth] SignOut error:", error);
      }
      router.replace("/");
      router.refresh();
    } finally {
      setLogoutLoading(false);
    }
  }

  return {
    loading,
    logoutLoading,
    isAuthenticated,
    session: (session as Session) ?? null,
    login,
    logout,
  };
}

function resolveCallbackUrl(rawUrl?: string): string {
  if (!rawUrl) return "/";
  if (typeof window === "undefined") return rawUrl;
  try {
    const target = new URL(rawUrl, window.location.origin);
    return `${target.pathname}${target.search}${target.hash}`;
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("[useAuth] resolveCallbackUrl error:", error);
    }
    return "/";
  }
}
