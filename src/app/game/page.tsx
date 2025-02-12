import { Music, Mic, Disc } from "lucide-react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ALLOWED_MODES } from "@/types/game";
import type { GameMode } from "@/types/game";
import { cn } from "@/lib/utils";

const gameModeConfig = {
  artists: {
    title: "Artists",
    description: "Guess which artist is more popular on Spotify",
    icon: Mic,
    gradient: "bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500",
  },
  albums: {
    title: "Albums",
    description: "Guess which album is more popular on Spotify",
    icon: Disc,
    gradient: "bg-gradient-to-br from-blue-500 via-indigo-500 to-violet-500",
  },
  tracks: {
    title: "Tracks",
    description: "Guess which track is more popular on Spotify",
    icon: Music,
    gradient: "bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500",
  },
} as const;

export default function GamePage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4" role="main">
      <h1 id="page-title">Select Your Game Mode</h1>
      <nav
        className="grid auto-rows-min gap-4 md:grid-cols-3"
        aria-labelledby="page-title"
      >
        {ALLOWED_MODES.map((mode) => {
          const config = gameModeConfig[mode as GameMode];
          return (
            <Link
              key={mode}
              href={`/game/${mode}`}
              className="group relative block aspect-video rounded-xl opacity-90 transition-all duration-300 hover:opacity-100 md:aspect-square"
              aria-label={`Play ${config.title.toLowerCase()} mode: ${config.description}`}
            >
              <Card
                className={cn(
                  "relative h-full transition-all duration-300",
                  config.gradient,
                )}
              >
                <CardHeader className="flex flex-row items-center gap-4 p-6">
                  <div
                    className="rounded-lg bg-white/10 p-2 backdrop-blur-sm"
                    aria-hidden="true"
                  >
                    <config.icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-white">
                    {config.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 pt-0">
                  <CardDescription className="text-lg text-white/80">
                    {config.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
