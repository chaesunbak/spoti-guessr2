import { Search, Home } from "lucide-react";
import { Input } from "@/components/ui/input";
import { UserProfile } from "@/components/user-profile";
import { MuteToggle } from "@/components/mute-toggle";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageSwitcher } from "@/components/language-switcher";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";

export async function AppHeader() {
  const t = await getTranslations("header");

  return (
    <header
      className="flex h-14 items-center gap-1 border-b px-4"
      role="banner"
    >
      <div className="flex-1" aria-hidden="true" />
      <div className="flex w-full max-w-xl items-center" role="search">
        <Button
          variant="outline"
          className="mr-2"
          asChild
          aria-label={t("navigateHome")}
          title={t("navigateHome")}
        >
          <Link href="/">
            <Home className="h-4 w-4" aria-hidden="true" />
            <span className="sr-only">{t("navigateHome")}</span>
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
            placeholder={t("searchPlaceholder")}
            aria-label={t("searchContent")}
            title={t("searchContent")}
            role="searchbox"
          />
        </div>
      </div>
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
