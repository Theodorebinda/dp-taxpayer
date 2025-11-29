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

const DEFAULT_ACCESS_TOKEN_TTL = 60 * 60 * 24 * 2; // 1h fallback

// -----------------------------------------------------------------------------
// HELPERS
// -----------------------------------------------------------------------------

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

  if (payload.data) return extractAccessToken(payload.data);

  return null;
}

function extractExpiresIn(payload: RefreshPayload | undefined): number | null {
  if (!payload || typeof payload !== "object") return null;

  if (typeof payload.expiresIn === "number") return payload.expiresIn;
  if (payload.data) return extractExpiresIn(payload.data);

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
  if (!accessToken) throw new Error("Refresh token invalide");

  const expiresIn = extractExpiresIn(payload);
  const decodedExp = getJwtExpiry(accessToken);

  const now = Math.floor(Date.now() / 1000);

  return {
    accessToken,
    accessTokenExpires:
      decodedExp ??
      (typeof expiresIn === "number" ? now + expiresIn : undefined) ??
      now + DEFAULT_ACCESS_TOKEN_TTL,
  };
}

// -----------------------------------------------------------------------------
// AUTH OPTIONS
// -----------------------------------------------------------------------------

export const authOptions: NextAuthOptions = {
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        identifier: { label: "Identifiant", type: "text" },
        password: { label: "Mot de passe", type: "password" },
      },

      async authorize(credentials) {
        if (!credentials?.identifier || !credentials?.password) return null;

        const result = await loginApi({
          identifier: credentials.identifier,
          password: credentials.password,
        });

        // Store refresh token
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

        // Extract taxpayerId from data.taxPayer.id
        // The response structure is: { data: { taxPayer: { id: string } } }
        const taxpayerId = backendUser.taxPayer?.id ?? null;

        // Build Unified User Object
        const user = {
          id: backendUser.id ?? credentials.identifier,
          name: backendUser.name ?? backendUser.mail ?? backendUser.id,
          email: backendUser.mail ?? null,
          roles: Array.isArray(backendUser.role)
            ? backendUser.role
                .map((r) =>
                  typeof r === "string"
                    ? r
                    : typeof r === "object" && r && "name" in r && r.name
                    ? String(r.name)
                    : undefined
                )
                .filter((r): r is string => typeof r === "string")
            : [],
          taxpayerId, //  ← IMPORTANT
          accessToken: result.access_token,
          accessTokenExpires:
            jwtExpiry ?? fallbackExpiry ?? now + DEFAULT_ACCESS_TOKEN_TTL,
        };

        return user as unknown as import("next-auth").User;
      },
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 7,
  },

  pages: {
    signIn: "/auth/login",
  },

  callbacks: {
    // ------------------------------
    // JWT TOKEN CALLBACK
    // ------------------------------
    async jwt({ token, user }) {
      // First login
      if (user) {
        const u = user as unknown as {
          accessToken?: string;
          accessTokenExpires?: number;
          taxpayerId?: string | null;
          roles?: string[];
        };
        token.accessToken = u.accessToken;
        token.accessTokenExpires = u.accessTokenExpires;
        token.taxpayerId = u.taxpayerId ?? null;
        token.roles = u.roles ?? [];
        return token;
      }

      // Check expiration
      const now = Math.floor(Date.now() / 1000);
      if (
        token.accessToken &&
        typeof token.accessTokenExpires === "number" &&
        now < token.accessTokenExpires - 30
      ) {
        return token;
      }

      // Refresh
      const refreshToken = await getRefreshTokenFromCookie();
      if (!refreshToken) {
        await clearRefreshTokenCookie();
        return {};
      }

      try {
        const refreshed = await refreshRequest(refreshToken);
        token.accessToken = refreshed.accessToken;
        token.accessTokenExpires =
          refreshed.accessTokenExpires ?? now + DEFAULT_ACCESS_TOKEN_TTL;

        return token;
      } catch {
        await clearRefreshTokenCookie();
        return {};
      }
    },

    // ------------------------------
    // SESSION CALLBACK
    // ------------------------------
    async session({ session, token }) {
      session.accessToken = token.accessToken as string | undefined;

      session.user = {
        ...session.user,
        taxpayerId: (token.taxpayerId as string | null | undefined) ?? null, //  ← exposé proprement
        roles: (token.roles as string[] | undefined) ?? [],
      };

      return session;
    },
  },
};
