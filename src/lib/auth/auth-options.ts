import type { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import {
  getRefreshTokenFromCookie,
  setRefreshTokenCookie,
  clearRefreshTokenCookie,
} from "@/lib/auth/token";

type BackendLoginResponse = {
  accessToken: string;
  refreshToken: string;
  expiresIn: number; // seconds
  user: {
    id: string;
    email?: string;
    name?: string;
    roles?: string[];
    [key: string]: unknown;
  };
};

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

async function loginRequest(
  username: string,
  password: string
): Promise<BackendLoginResponse> {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
    cache: "no-store",
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error?.message || "Authentification échouée");
  }
  return res.json();
}

async function refreshRequest(
  refreshToken: string
): Promise<{ accessToken: string; expiresIn: number }> {
  const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
    cache: "no-store",
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error?.message || "Refresh token invalide");
  }
  return res.json();
}

export const authOptions: NextAuthOptions = {
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(
        credentials: { username?: string; password?: string } | undefined
      ) {
        if (!credentials?.username || !credentials?.password) return null;
        const result = await loginRequest(
          credentials.username,
          credentials.password
        );
        // Stocker le refresh token côté cookie HttpOnly (chiffré)
        await setRefreshTokenCookie(result.refreshToken);
        // Construire un User minimal avec id (requis) et caster les champs additionnels
        const user = {
          id: result.user.id,
          name: result.user.name,
          email: result.user.email,
          // champs additionnels lus plus tard dans le callback jwt
          accessToken: result.accessToken,
          expiresIn: result.expiresIn,
          roles: result.user.roles,
        } as unknown as import("next-auth").User;
        return user;
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 7, // 7j
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      type MutableRecord = Record<string, unknown>;
      const u = user as unknown as MutableRecord | undefined;
      const t = token as unknown as MutableRecord;
      // Initial sign-in
      if (u && u.accessToken) {
        const now = Math.floor(Date.now() / 1000);
        t.accessToken = u.accessToken;
        t.accessTokenExpires = now + ((u.expiresIn as number) ?? 0);
        t.user = {
          id: u.id as string,
          email: u.email as string | undefined,
          name: u.name as string | undefined,
          roles: u.roles as string[] | undefined,
        } as Record<string, unknown>;
        return token;
      }
      // Subsequent calls - check expiration
      const now = Math.floor(Date.now() / 1000);
      if (
        (t.accessToken as unknown) &&
        (t.accessTokenExpires as unknown) &&
        now < (t.accessTokenExpires as number) - 30
      ) {
        return token;
      }
      // Try refresh
      const refreshToken = await getRefreshTokenFromCookie();
      if (!refreshToken) {
        await clearRefreshTokenCookie();
        return {};
      }
      try {
        const refreshed = await refreshRequest(refreshToken);
        t.accessToken = refreshed.accessToken;
        t.accessTokenExpires = now + refreshed.expiresIn;
        return token;
      } catch {
        await clearRefreshTokenCookie();
        return {};
      }
    },
    async session({ session, token }) {
      type MutableRecord = Record<string, unknown>;
      const s = session as unknown as MutableRecord;
      const t = token as unknown as MutableRecord;
      s.accessToken = t.accessToken;
      s.user = t.user || s.user;
      return session;
    },
  },
};
