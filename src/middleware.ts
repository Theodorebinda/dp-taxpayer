import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { isPublicPath } from "@/lib/auth/public-paths";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) {
    const isPublicDestination = isPublicPath(pathname);
    const targetPath = isPublicDestination ? pathname : "/";
    const url = new URL(targetPath, req.url);
    if (!isPublicDestination) {
      url.searchParams.set(
        "callbackUrl",
        req.nextUrl.pathname + req.nextUrl.search
      );
    }
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!.*\\.[\\w]+$|_next).*)"],
};
