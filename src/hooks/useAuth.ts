"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import type { Session } from "next-auth";
import { useState } from "react";

type LoginInput = { username: string; password: string };
type LoginResult = { ok: true } | { ok: false; error?: string };

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

  async function login(input: LoginInput): Promise<LoginResult> {
    setLoading(true);
    try {
      const res = await signIn("credentials", {
        ...input,
        redirect: false,
      });
      if (res?.error) throw new Error(res.error);
      await update();
      return { ok: true };
    } catch (e: unknown) {
      const err = e as { message?: string };
      return { ok: false, error: err?.message || "Erreur de connexion" };
    } finally {
      setLoading(false);
    }
  }

  async function logout(): Promise<void> {
    await signOut({ redirect: true, callbackUrl: "/login" });
  }

  return {
    loading,
    isAuthenticated,
    session: (session as Session) ?? null,
    login,
    logout,
  };
}
