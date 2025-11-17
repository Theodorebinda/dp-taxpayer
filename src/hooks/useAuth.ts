"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import type { Session } from "next-auth";
import { useEffect, useState } from "react";

type LoginInput = { identifier: string; password: string };
type LoginResult =
  | { ok: true; message?: string }
  | { ok: false; error?: string };

type UseAuthReturn = {
  loading: boolean;
  isAuthenticated: boolean;
  session: Session | null;
  login: (input: LoginInput) => Promise<LoginResult>;
  logout: () => Promise<void>;
};

export function useAuth(): UseAuthReturn {
  const { data: session, status, update } = useSession();
  const [loading, setLoading] = useState(false);
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
    await signOut({ redirect: true, callbackUrl: "/auth/login" });
  }

  return {
    loading,
    isAuthenticated,
    session: (session as Session) ?? null,
    login,
    logout,
  };
}
