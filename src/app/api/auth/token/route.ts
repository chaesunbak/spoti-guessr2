import { NextResponse } from "next/server";
import { SignJWT } from "jose";
import { cookies } from "next/headers";

const SECRET_KEY = process.env.JWT_SECRET_KEY || "your-secret-key";
const encoder = new TextEncoder();

export async function POST(request: Request) {
  try {
    const { user } = await request.json();

    const token = await new SignJWT({
      uid: user.uid,
      email: user.email,
      permission: user.permission,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(encoder.encode(SECRET_KEY));

    // Set HTTP-only cookie
    const cookieStore = cookies();
    (await cookieStore).set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      path: "/", // add: allow cookie access from all paths
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create token" },
      { status: 500 },
    );
  }
}
