import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const handleI18nRouting = createMiddleware(routing);
const SECRET_KEY = process.env.JWT_SECRET_KEY || "your-secret-key";
const encoder = new TextEncoder();

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isUploadPath = /^\/(?:ko\/)?upload$/.test(pathname);

  if (isUploadPath) {
    const authToken = request.cookies.get("auth_token");

    if (!authToken) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    try {
      const { payload } = await jwtVerify(
        authToken.value,
        encoder.encode(SECRET_KEY),
      );

      if (payload.permission !== "ADMIN") {
        return NextResponse.redirect(new URL("/", request.url));
      }
    } catch (error) {
      console.error("Auth error:", error);
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return handleI18nRouting(request);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
