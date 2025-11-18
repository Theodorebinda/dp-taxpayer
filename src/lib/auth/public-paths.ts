const PUBLIC_PATH_PATTERNS: RegExp[] = [
  /^\/$/, // landing page
  /^\/login$/,
  /^\/register$/,
  /^\/registration(\/.*)?$/,
  /^\/maintenance(\/.*)?$/,
  /^\/auth\/login$/,
  /^\/auth\/registration(\/.*)?$/,
  /^\/marketing(\/.*)?$/,
  /^\/public(\/.*)?$/,
  /^\/api(\/.*)?$/,
  /^\/_next(\/.*)?$/,
  /^\/favicon\.ico$/,
  /^\/robots\.txt$/,
  /^\/sitemap\.xml$/,
];

export function isPublicPath(pathname: string | null | undefined): boolean {
  const path = pathname ?? "/";
  return PUBLIC_PATH_PATTERNS.some((pattern) => pattern.test(path));
}

export { PUBLIC_PATH_PATTERNS };
