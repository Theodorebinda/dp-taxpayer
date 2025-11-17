import type { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { Buffer } from "buffer";
import {
  getRefreshTokenFromCookie,
  setRefreshTokenCookie,
  clearRefreshTokenCookie,
} from "@/lib/auth/token";
import {
  login as loginApi,
  type BackendLoginUser,
} from "@/services/auth.service";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";
const DEFAULT_ACCESS_TOKEN_TTL = 60 * 60; // 1h fallback

type RefreshPayload = {
  access_token?: string;
  accessToken?: string;
  expiresIn?: number;
  data?: RefreshPayload;
};

function decodeBase64Url(segment: string): string {
  let normalized = segment.replace(/-/g, "+").replace(/_/g, "/");
  while (normalized.length % 4 !== 0) {
    normalized += "=";
  }
  return Buffer.from(normalized, "base64").toString("utf8");
}

function getJwtExpiry(token: string | null | undefined): number | null {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length < 2) return null;
  try {
    const payload = JSON.parse(decodeBase64Url(parts[1]) || "{}");
    return typeof payload.exp === "number" ? payload.exp : null;
  } catch {
    return null;
  }
}

function extractAccessToken(
  payload: RefreshPayload | undefined
): string | null {
  if (!payload || typeof payload !== "object") return null;
  if (typeof payload.access_token === "string") return payload.access_token;
  if (typeof payload.accessToken === "string") return payload.accessToken;
  if (payload.data && typeof payload.data === "object") {
    return extractAccessToken(payload.data as RefreshPayload);
  }
  return null;
}

function extractExpiresIn(payload: RefreshPayload | undefined): number | null {
  if (!payload || typeof payload !== "object") return null;
  if (typeof payload.expiresIn === "number") return payload.expiresIn;
  if (payload.data && typeof payload.data === "object") {
    return extractExpiresIn(payload.data as RefreshPayload);
  }
  return null;
}

async function refreshRequest(
  refreshToken: string
): Promise<{ accessToken: string; accessTokenExpires?: number }> {
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
  const payload = (await res.json()) as RefreshPayload;
  const accessToken = extractAccessToken(payload);
  if (!accessToken) {
    throw new Error("Refresh token invalide");
  }
  const expiresIn = extractExpiresIn(payload);
  const decodedExp = getJwtExpiry(accessToken);
  const now = Math.floor(Date.now() / 1000);
  const computed =
    decodedExp ??
    (typeof expiresIn === "number" ? now + expiresIn : undefined) ??
    now + DEFAULT_ACCESS_TOKEN_TTL;
  return {
    accessToken,
    accessTokenExpires: computed,
  };
}

export const authOptions: NextAuthOptions = {
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        identifier: { label: "Identifiant", type: "text" },
        password: { label: "Mot de passe", type: "password" },
      },
      async authorize(
        credentials: { identifier?: string; password?: string } | undefined
      ) {
        if (!credentials?.identifier || !credentials?.password) return null;
        const result = await loginApi({
          identifier: credentials.identifier,
          password: credentials.password,
        });
        if (result.refresh_token) {
          await setRefreshTokenCookie(result.refresh_token);
        } else {
          await clearRefreshTokenCookie();
        }
        const backendUser = (result.data ?? {
          id: credentials.identifier,
        }) as BackendLoginUser;
        const now = Math.floor(Date.now() / 1000);
        const jwtExpiry = getJwtExpiry(result.access_token);
        const fallbackExpiry =
          typeof result.expiresIn === "number"
            ? now + result.expiresIn
            : undefined;
        const normalizedRoles = Array.isArray(backendUser.role)
          ? backendUser.role
              .map((role) => {
                if (typeof role === "string") return role;
                if (role && typeof role === "object") {
                  if ("name" in role && role.name) {
                    return String(
                      (role as Record<string, unknown>).name as string
                    );
                  }
                  if ("code" in role && role.code) {
                    return String(
                      (role as Record<string, unknown>).code as string
                    );
                  }
                }
                return undefined;
              })
              .filter((value): value is string => Boolean(value))
          : undefined;
        const user = {
          id: backendUser.id ?? credentials.identifier,
          name:
            backendUser.name ??
            backendUser.mail ??
            backendUser.id ??
            credentials.identifier,
          email: backendUser.mail ?? credentials.identifier,
          roles: normalizedRoles,
          accessToken: result.access_token,
          accessTokenExpires:
            jwtExpiry ?? fallbackExpiry ?? now + DEFAULT_ACCESS_TOKEN_TTL,
          profile: {
            ...backendUser,
            redirectToOpt: result.redirectToOpt,
            message: result.message,
          },
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
    signIn: "/auth/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      type MutableRecord = Record<string, unknown>;
      const u = user as unknown as MutableRecord | undefined;
      const t = token as unknown as MutableRecord;
      // Initial sign-in
      if (u && u.accessToken) {
        t.accessToken = u.accessToken;
        const computedExpiry =
          (u.accessTokenExpires as number | undefined) ??
          getJwtExpiry(u.accessToken as string) ??
          Math.floor(Date.now() / 1000) + DEFAULT_ACCESS_TOKEN_TTL;
        t.accessTokenExpires = computedExpiry;
        t.user =
          (u.profile as Record<string, unknown> | undefined) ??
          ({
            id: u.id as string,
            email: u.email as string | undefined,
            name: u.name as string | undefined,
            roles: u.roles as string[] | undefined,
          } as Record<string, unknown>);
        return token;
      }
      // Subsequent calls - check expiration
      const now = Math.floor(Date.now() / 1000);
      const expiresAt =
        typeof t.accessTokenExpires === "number"
          ? (t.accessTokenExpires as number)
          : null;
      if ((t.accessToken as unknown) && expiresAt && now < expiresAt - 30) {
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
        t.accessTokenExpires =
          refreshed.accessTokenExpires ?? now + DEFAULT_ACCESS_TOKEN_TTL;
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
