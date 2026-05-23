import { UserProfile } from "@/components/user-profile";
import { MuteToggle } from "@/components/mute-toggle";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageSwitcher } from "@/components/language-switcher";

export async function AppHeader() {

  return (
    <header
      className="flex h-14 items-center gap-1 border-b px-4"
      role="banner"
    >
      <div className="flex-1" aria-hidden="true" />
      <div className="flex w-full max-w-xl items-center"></div>
      <div
        className="flex flex-1 items-center justify-end gap-2"
        role="toolbar"
        aria-label="User actions"
      >
        <LanguageSwitcher />
        <MuteToggle />
        <ThemeToggle />
        <UserProfile />
      </div>
    </header>
  );
}
