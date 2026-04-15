import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { FP_REFRESH_COOKIE, FP_ROLE_COOKIE } from "@/lib/auth-cookies";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const refresh = request.cookies.get(FP_REFRESH_COOKIE)?.value;
  const role = request.cookies.get(FP_ROLE_COOKIE)?.value;

  const isProtected =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/onboarding") ||
    pathname.startsWith("/cuenta") ||
    pathname.startsWith("/skills");

  if (isProtected && !refresh) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/login";
    url.searchParams.set("from", pathname);
    return NextResponse.redirect(url);
  }
  if (pathname.startsWith("/dashboard") && role !== "admin") {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/dashboard",
    "/dashboard/:path*",
    "/onboarding",
    "/onboarding/:path*",
    "/cuenta",
    "/cuenta/:path*",
    "/skills",
    "/skills/:path*",
  ],
};

