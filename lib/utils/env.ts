export function readPublicEnv(
  key: string,
  fallback?: string
): string | undefined {
  const value =
    typeof process !== "undefined"
      ? (process.env[key] as string | undefined)
      : undefined;
  return value ?? fallback;
}

export function readClientEnv(
  key: string,
  fallback?: string
): string | undefined {
  if (typeof window === "undefined") return fallback;
  // Pas d'accès direct aux env côté client, préférer NEXT_PUBLIC_* côté process.env
  const value =
    typeof process !== "undefined"
      ? (process.env[key] as string | undefined)
      : undefined;
  return value ?? fallback;
}
