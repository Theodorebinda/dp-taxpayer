import { cookies } from "next/headers";
import { EncryptJWT, jwtDecrypt } from "jose";

const REFRESH_TOKEN_COOKIE_NAME = "dp_rt";
const REFRESH_MAX_AGE_SECONDS = 60 * 60 * 24 * 30; // 30j

function getSecretKey(): Uint8Array {
  const secret =
    process.env.NEXTAUTH_SECRET ||
    process.env.AUTH_SECRET ||
    "change-me-in-env";
  const encoder = new TextEncoder();
  const raw = encoder.encode(secret);
  // Ensure 32 bytes for A256GCM. Slice or pad deterministically.
  if (raw.length >= 32) return raw.slice(0, 32);
  const padded = new Uint8Array(32);
  padded.set(raw);
  return padded;
}

export async function encryptRefreshToken(
  refreshToken: string
): Promise<string> {
  const key = getSecretKey();
  const jwt = await new EncryptJWT({ rt: refreshToken })
    .setProtectedHeader({ alg: "dir", enc: "A256GCM" })
    .setIssuedAt()
    .setExpirationTime(
      `${Math.floor(REFRESH_MAX_AGE_SECONDS / (60 * 60 * 24))}d`
    )
    .encrypt(key);
  return jwt;
}

export async function decryptRefreshToken(
  encrypted: string
): Promise<string | null> {
  try {
    const key = getSecretKey();
    const { payload } = await jwtDecrypt(encrypted, key);
    const value = payload?.rt;
    return typeof value === "string" ? value : null;
  } catch {
    return null;
  }
}

export async function setRefreshTokenCookie(refreshToken: string) {
  const store = await cookies();
  const encrypted = await encryptRefreshToken(refreshToken);
  store.set(REFRESH_TOKEN_COOKIE_NAME, encrypted, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: REFRESH_MAX_AGE_SECONDS,
  });
}

export async function getRefreshTokenFromCookie(): Promise<string | null> {
  const store = await cookies();
  const raw = store.get(REFRESH_TOKEN_COOKIE_NAME)?.value;
  if (!raw) return null;
  return decryptRefreshToken(raw);
}

export async function clearRefreshTokenCookie() {
  const store = await cookies();
  store.delete(REFRESH_TOKEN_COOKIE_NAME);
}

export const refreshTokenCookie = {
  name: REFRESH_TOKEN_COOKIE_NAME,
  maxAge: REFRESH_MAX_AGE_SECONDS,
};
