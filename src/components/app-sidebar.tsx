import { Home, Play, ChevronRight } from "lucide-react";
import {
  Sidebar,
  SidebarHeader,
  SidebarTrigger,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Link } from "@/i18n/navigation";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import Image from "next/image";
import { getTranslations } from "next-intl/server";

export async function AppSidebar() {
  const t = await getTranslations("navigation");

  return (
    <Sidebar
      collapsible="icon"
      className="@container"
      role="navigation"
      aria-label="Main navigation"
    >
      <SidebarHeader>
        <SidebarMenu>
          <Collapsible defaultOpen className="group/collapsible">
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton asChild>
                  <Link
                    href="/"
                    className="flex items-center gap-2 p-2"
                    title={t("home")}
                    aria-label="Go to home page"
                  >
                    <Image
                      src="/logo.png"
                      alt="Spoti-Guessr Logo"
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                    <span className="text-xl font-bold">{t("appName")}</span>
                  </Link>
                </SidebarMenuButton>
              </CollapsibleTrigger>
            </SidebarMenuItem>
          </Collapsible>
        </SidebarMenu>

        <SidebarTrigger
          title="Toggle Sidebar"
          aria-label="Toggle sidebar menu"
        />
      </SidebarHeader>
      <SidebarContent className="flex flex-col justify-between">
        <SidebarGroup>
          <SidebarGroupLabel>{t("application")}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild title={t("home")}>
                  <Link href="/" aria-label="Navigate to home page">
                    <Home aria-hidden="true" />
                    <span>{t("home")}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <Collapsible defaultOpen className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton asChild title={t("game")}>
                      <Link href="/game" aria-label="Open game modes menu">
                        <Play aria-hidden="true" />
                        <span>{t("game")}</span>
                        <ChevronRight
                          className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"
                          aria-hidden="true"
                        />
                      </Link>
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub role="menu" aria-label="Game modes">
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild title={t("artists")}>
                          <Link
                            href="/game/artists"
                            aria-label="Play artists game mode"
                          >
                            <span>{t("artists")}</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild title={t("albums")}>
                          <Link
                            href="/game/albums"
                            aria-label="Play albums game mode"
                          >
                            <span>{t("albums")}</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild title={t("tracks")}>
                          <Link
                            href="/game/tracks"
                            aria-label="Play tracks game mode"
                          >
                            <span>{t("tracks")}</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="hidden @[13rem]:block">
        <footer
          className="border-t border-border/90 p-2 text-muted-foreground"
          role="contentinfo"
          aria-label="Site information"
        >
          <div className="space-y-2 text-xs font-normal">
            <nav className="flex flex-col gap-1" aria-label="Legal links">
              <Link href="/terms" className="hover:text-foreground">
                {t("termsOfService")}
              </Link>
              <Link href="/privacy" className="hover:text-foreground">
                {t("privacyPolicy")}
              </Link>
              <a
                href="https://github.com/chaesunbak/spoti-guessr2"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground"
              >
                {t("sourceCode")}
              </a>
            </nav>

            <p className="text-xs">{t("disclaimer")}</p>

            <div className="pt-2">
              <p className="pt-2 text-xs" style={{ whiteSpace: "pre-line" }}>
                {t("copyright")}
              </p>
            </div>
          </div>
        </footer>
      </SidebarFooter>
    </Sidebar>
  );
}
