import Image from "next/image";
import { Play, ChartBarDecreasing } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <div className="rounded-xl bg-muted/50 p-8 transition-all duration-300 hover:bg-muted/70 md:col-span-2 md:row-span-2">
          <div className="flex h-full flex-col justify-between gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <h1>Spoti-Guessr</h1>
                <Image
                  src="/logo.png"
                  alt="Spoti-Guessr"
                  width={32}
                  height={32}
                  className="animate-wiggle transition-all duration-300 hover:animate-none"
                />
              </div>
              <p className="max-w-lg text-muted-foreground">
                What's trending? Compare songs, artists, and albums to guess
                which one is more popular on{" "}
                <a
                  href="https://open.spotify.com/"
                  target="_blank"
                  className="font-bold text-[#81b71a] hover:underline"
                  tabIndex={-1}
                >
                  Spotify
                </a>
                .
              </p>
            </div>
            <div className="flex gap-2 lg:gap-4">
              <Button variant="default" asChild>
                <Link href="/game">
                  <Play className="mr-2 h-4 w-4" />
                  Start Playing
                </Link>
              </Button>
              {/* TODO : Add Leaderboard Page */}
              <Button variant="secondary" asChild disabled>
                <a>
                  <ChartBarDecreasing />
                  View Leaderboard
                </a>
              </Button>
            </div>
          </div>
        </div>
        <div className="aspect-video rounded-xl bg-muted/50 p-6 transition-all duration-300 hover:bg-muted/70">
          <div className="flex h-full flex-col justify-between">
            <h3 className="mb-2">Release Notes</h3>
            <div className="scrollbar-none flex-1 space-y-1 overflow-y-auto text-xs text-muted-foreground md:text-sm">
              <p>Current Version: v0.1.0</p>
              <p>Last Updated: February 2025</p>
              <p>New Features:</p>
              <ul className="list-inside list-disc space-y-1 pl-2">
                <li>New Fancy Layout</li>
                <li>Game Feature</li>
                <li>Migration to Next.js</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="aspect-video rounded-xl bg-muted/50 transition-all duration-300 hover:bg-muted/70" />
        <div className="aspect-video rounded-xl bg-muted/50 transition-all duration-300 hover:bg-muted/70" />
        <div className="aspect-video rounded-xl bg-muted/50 transition-all duration-300 hover:bg-muted/70" />
        <div className="aspect-video rounded-xl bg-muted/50 transition-all duration-300 hover:bg-muted/70" />
      </div>
      <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
    </div>
  );
}
