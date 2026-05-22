import { UserProfile } from "@/components/user-profile";
import { MuteToggle } from "@/components/mute-toggle";
import { ThemeToggle } from "@/components/theme-toggle";

export function AppHeader() {
  return (
    <header
      className="flex h-14 items-center gap-1 border-b px-4"
      role="banner"
    >
      <div className="flex-1" aria-hidden="true" /> {/* Left spacing */}
      {/* Center search input */}
      <div className="flex w-full max-w-xl items-center"></div>
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
