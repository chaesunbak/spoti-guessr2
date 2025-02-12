import { Search, Home } from "lucide-react";
import { Input } from "@/components/ui/input";
import { UserProfile } from "@/app/_components/user-profile";
import { MuteToggle } from "@/app/_components/mute-toggle";
import { ThemeToggle } from "@/app/_components/theme-toggle";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function AppHeader() {
  return (
    <header
      className="flex h-14 items-center gap-1 border-b px-4"
      role="banner"
    >
      <div className="flex-1" aria-hidden="true" /> {/* Left spacing */}
      {/* Center search input */}
      <div className="flex w-full max-w-xl items-center" role="search">
        <Button
          variant="outline"
          className="mr-2"
          asChild
          aria-label="Navigate to Home"
          title="Navigate to Home"
        >
          <Link href="/">
            <Home className="h-4 w-4" aria-hidden="true" />
            <span className="sr-only">Home</span>
          </Link>
        </Button>
        <div className="relative w-full">
          <Search
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            type="search"
            className="pl-10"
            placeholder="Search..."
            aria-label="Search content"
            title="Search content"
            role="searchbox"
          />
        </div>
      </div>
      {/* Right section with user profile */}
      <div
        className="flex flex-1 items-center justify-end gap-2"
        role="toolbar"
        aria-label="User actions"
      >
        <MuteToggle />
        <ThemeToggle />
        <UserProfile />
      </div>
    </header>
  );
}
