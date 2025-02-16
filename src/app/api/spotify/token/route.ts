import { NextResponse } from "next/server";

const CLIENT_ID = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET;

export async function GET() {
  try {
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `grant_type=client_credentials&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}`,
    });

    if (!response.ok) {
      throw new Error("Failed to get Spotify token");
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      access_token: data.access_token,
    });
  } catch (error) {
    console.error("Spotify token error:", error);
    return NextResponse.json(
      { error: "Failed to get Spotify token" },
      { status: 500 },
    );
  }
}
