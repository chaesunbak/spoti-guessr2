"use client";

import { useTheme } from "next-themes";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface SpotifyLogoProps {
  className?: string;
}

export function SpotifyLogo({ className }: SpotifyLogoProps) {
  const { theme } = useTheme();

  return (
    <Image
      src={
        theme === "dark" ? "/spotify-logo-white.png" : "/spotify-logo-black.png"
      }
      alt="Spotify"
      width={80}
      height={24}
      className={cn("relative -top-[1px]", className)}
    />
  );
}
