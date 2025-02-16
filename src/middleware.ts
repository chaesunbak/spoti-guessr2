import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const SECRET_KEY = process.env.JWT_SECRET_KEY || "your-secret-key";
const encoder = new TextEncoder();

export async function middleware(request: NextRequest) {
  const authToken = request.cookies.get("auth_token");

  // redirect to login page if no auth token
  if (!authToken) {
    console.log("No auth token found");
    return NextResponse.redirect(new URL("/", request.url));
  }

  try {
    const { payload } = await jwtVerify(
      authToken.value,
      encoder.encode(SECRET_KEY),
    );

    // redirect to home if permission is not "ADMIN"
    if (payload.permission !== "ADMIN") {
      console.log("User permission:", payload.permission);
      return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Auth error:", error);
    // redirect to home if token is invalid
    return NextResponse.redirect(new URL("/", request.url));
  }
}

// apply middleware only to upload path
export const config = {
  matcher: "/upload",
};
