import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { isPublicPath } from "@/lib/auth/public-paths";

const AUTH_PAGES = [
  "/auth/login",
  "/auth/registration",
  "/auth/otp",
  "/login",
  "/register",
  "/registration",
];

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  // 1. Ignorer assets & fichiers statiques
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.match(/\.(ico|png|jpg|jpeg|svg|webp|txt|xml|json)$/)
  ) {
    return NextResponse.next();
  }

  // 2. Vérifier si route publique
  const publicRoute = isPublicPath(pathname);

  // 3. Récupération token NextAuth
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const isAuthenticated = !!token;

  // ==================================================
  //  🟦 CAS 1 : Utilisateur NON AUTHENTIFIÉ
  // ==================================================
  if (!isAuthenticated) {
    if (publicRoute) return NextResponse.next();

    // Route privée ⇒ redirection vers /auth/login
    const loginUrl = new URL("/auth/login", req.url);
    loginUrl.searchParams.set("callbackUrl", req.url);
    return NextResponse.redirect(loginUrl);
  }

  // ==================================================
  //  🟩 CAS 2 : Utilisateur AUTHENTIFIÉ
  // ==================================================

  // Interdire uniquement les pages d’auth
  const isAuthPage = AUTH_PAGES.some((p) => pathname.startsWith(p));

  if (isAuthPage) {
    // Redirection vers list
    return NextResponse.redirect(new URL("/list", req.url));
  }

  console.log("MIDDLEWARE PATH:", pathname);
  console.log("IS PUBLIC:", isPublicPath(pathname));
  console.log("TOKEN:", !!token);

  // Autoriser tout le reste (y compris landing, marketing, public…)
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!.*\\.[\\w]+$|_next).*)"],
};
