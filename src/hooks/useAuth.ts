"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { resetClientState } from "@/lib/logout/reset-client-state";

type LoginInput = { identifier: string; password: string };
type LoginResult =
  | { ok: true; message?: string }
  | { ok: false; error?: string };

export function useAuth() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/list";

  const { data: session, status, update } = useSession();

  const [loading, setLoading] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);

  const isAuthenticated = status === "authenticated";

  async function login(input: LoginInput): Promise<LoginResult> {
    setLoading(true);
    try {
      const res = await signIn("credentials", {
        ...input,
        redirect: false,
      });

      if (!res) return { ok: false, error: "Réponse invalide du serveur." };
      if (res.error) return { ok: false, error: res.error };

      // Mise à jour session NextAuth
      await update();

      // ⚠️ Middleware gère la protection et la redirection
      router.replace(callbackUrl);

      return { ok: true, message: "Connexion réussie" };
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : typeof error === "string"
          ? error
          : undefined;
      return { ok: false, error: message || "Erreur de connexion" };
    } finally {
      setLoading(false);
    }
  }

  async function logout(): Promise<void> {
    setLogoutLoading(true);

    // 1. Nettoyage local
    await resetClientState().catch(() => {});

    try {
      // 2. Déconnexion NextAuth (ne redirige pas)
      await signOut({ redirect: false });

      // 3. Envoi vers login (middleware redirigera selon le token)
      router.replace("/auth/login");
    } catch {
      router.replace("/auth/login");
    } finally {
      setLogoutLoading(false);
    }
  }

  return {
    loading,
    logoutLoading,
    isAuthenticated,
    session: session ?? null,
    login,
    logout,
  };
}
