import { Search, Home } from "lucide-react";
import { Input } from "@/components/ui/input";
import { UserProfile } from "@/components/user-profile";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function AppHeader() {
  return (
    <div className="flex h-14 items-center px-4 border-b">
      <div className="flex-1" /> {/* Left spacing */}
      {/* Center search input */}
      <div className="flex items-center max-w-xl w-full">
        <Button variant="outline" className="mr-2" asChild>
          <Link href="/search">
            <Home />
            <span className="sr-only">Home</span>
          </Link>
        </Button>
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input className="pl-10" placeholder="Search..." />
        </div>
      </div>
      {/* Right section with user profile */}
      <div className="flex-1 flex justify-end items-center gap-2">
        <ThemeToggle />
        <UserProfile />
      </div>
    </div>
  );
}
