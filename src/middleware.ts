import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const PUBLIC_PATHS: RegExp[] = [
  /^\/$/,
  /^\/login$/,
  /^\/register$/,
  /^\/registration(\/.*)?$/,
  /^\/marketing(\/.*)?$/,
  /^\/(public)(\/.*)?$/,
  /^\/api(\/.*)?$/,
  /^\/_next(\/.*)?$/,
  /^\/favicon\.ico$/,
  /^\/robots\.txt$/,
  /^\/sitemap\.xml$/,
];

function isPublicPath(pathname: string) {
  return PUBLIC_PATHS.some((rx) => rx.test(pathname));
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) {
    const url = new URL("/login", req.url);
    url.searchParams.set(
      "callbackUrl",
      req.nextUrl.pathname + req.nextUrl.search
    );
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!.*\\.[\\w]+$|_next).*)"],
};
