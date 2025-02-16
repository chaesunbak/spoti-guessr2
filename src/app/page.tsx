import Image from "next/image";
import { Play, ChartBarDecreasing } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-2 lg:p-4">
      <div className="grid h-full w-full auto-rows-min gap-4 md:grid-cols-3">
        <section className="bg-muted/50 hover:bg-muted/70 rounded-xl p-2 transition-all duration-300 md:col-span-2 md:row-span-2 md:p-4 lg:p-6">
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
              <p className="text-muted-foreground max-w-lg">
                What's trending? Compare songs, artists, and albums to guess
                which one is more popular on{" "}
                <a
                  href="https://open.spotify.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-[#81b71a] hover:underline"
                  tabIndex={-1}
                  aria-label="Visit Spotify's official website"
                >
                  Spotify
                </a>
                .
              </p>
            </div>
            <div
              className="flex flex-col gap-2 lg:flex-row lg:gap-4"
              role="navigation"
              aria-label="Main actions"
            >
              <Button variant="default" asChild>
                <Link href="/game" aria-label="Start playing the game">
                  <Play className="mr-2 h-4 w-4" aria-hidden="true" />
                  Start Playing
                </Link>
              </Button>
              {/* TODO : Add Leaderboard Page */}
              <Button
                variant="secondary"
                asChild
                disabled
                aria-label="View leaderboard (Coming soon)"
              >
                <a>
                  <ChartBarDecreasing aria-hidden="true" />
                  View Leaderboard
                </a>
              </Button>
            </div>
          </div>
        </section>
        <section className="bg-muted/50 hover:bg-muted/70 aspect-video rounded-xl p-2 transition-all duration-300 md:p-4 lg:p-6">
          <div className="flex h-full flex-col justify-between">
            <h3 className="mb-2">Release Notes</h3>
            <div className="scrollbar-none text-muted-foreground flex-1 space-y-1 overflow-y-auto text-xs md:text-sm">
              <p>Current Version: v0.1.0</p>
              <p>Last Updated: February 2025</p>
              <p>New Features:</p>
              <ul
                className="list-inside list-disc space-y-1 pl-2"
                role="list"
                aria-label="New features"
              >
                <li>New Fancy Layout</li>
                <li>Game Feature</li>
                <li>Migration to Next.js</li>
              </ul>
            </div>
          </div>
        </section>
        <div
          className="bg-muted/50 hover:bg-muted/70 aspect-video rounded-xl transition-all duration-300"
          aria-hidden="true"
        />
        <div
          className="bg-muted/50 hover:bg-muted/70 aspect-video rounded-xl transition-all duration-300"
          aria-hidden="true"
        />
        <div
          className="bg-muted/50 hover:bg-muted/70 aspect-video rounded-xl transition-all duration-300"
          aria-hidden="true"
        />
        <div
          className="bg-muted/50 hover:bg-muted/70 aspect-video rounded-xl transition-all duration-300"
          aria-hidden="true"
        />
      </div>
      <div
        className="bg-muted/50 hidden min-h-[100vh] flex-1 rounded-xl md:min-h-min"
        aria-hidden="true"
      />
    </div>
  );
}
