import { NextResponse } from "next/server";
import { withAuth } from "next-auth/middleware";
import type { NextRequest } from "next/server";
import NextAuth from "next-auth";
import authConfig from "./auth.config";

const publicRoutes = ["/auth/login", "/auth/register", "/auth/forgot-password"];

const authRoutes = ["/auth/login", "/auth/register"];

// const { middleware } = NextAuth(authConfig);

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isPublicPath = publicRoutes.some((path) => pathname.startsWith(path));

  const isAuthRoute = authRoutes.some((path) => pathname.startsWith(path));

  const token = request.cookies.get("auth-token")?.value;

  if (request.nextUrl.search) {
    const newUrl = request.nextUrl.clone();
    newUrl.search = "";
    return NextResponse.redirect(newUrl);
  }

  if (token && isAuthRoute) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
  // if (!isPublicPath && !token) {
  //   // Store the original URL to redirect back after login
  //   const response = NextResponse.redirect(new URL("/auth/login", request.url));
  //   response.cookies.set("redirectTo", pathname);
  //   return response;
  // }

  if (!token && !isPublicPath) {
    const redirectUrl = new URL("/auth/login", request.url);
    redirectUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(redirectUrl);
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all routes except static files, favicon, etc.
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
