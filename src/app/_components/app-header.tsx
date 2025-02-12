import { Search, Home } from "lucide-react";
import { Input } from "@/components/ui/input";
import { UserProfile } from "@/app/_components/user-profile";
import { MuteToggle } from "@/app/_components/mute-toggle";
import { ThemeToggle } from "@/app/_components/theme-toggle";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function AppHeader() {
  return (
    <header className="flex h-14 items-center border-b px-4">
      <div className="flex-1" /> {/* Left spacing */}
      {/* Center search input */}
      <div className="flex w-full max-w-xl items-center">
        <Button
          variant="outline"
          className="mr-2"
          asChild
          title="Navigate to Home"
        >
          <Link href="/">
            <Home />
            <span className="sr-only">Home</span>
          </Link>
        </Button>
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input className="pl-10" placeholder="Search..." />
        </div>
      </div>
      {/* Right section with user profile */}
      <div className="flex flex-1 items-center justify-end gap-2">
        <MuteToggle />
        <ThemeToggle />
        <UserProfile />
      </div>
    </header>
  );
}
