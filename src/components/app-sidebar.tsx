import { Home, Play, ChevronRight, Trophy, type LucideIcon } from "lucide-react";
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
  SidebarFooter,
} from "@/components/ui/sidebar";

const menuButtonClass =
  "peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-none ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-primary focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-[[data-sidebar=menu-action]]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-primary group-data-[collapsible=icon]:!size-8 group-data-[collapsible=icon]:!p-2 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 h-8 text-sm";
import { Link } from "@/i18n/navigation";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import Image from "next/image";
import { getTranslations } from "next-intl/server";

type NavItem = {
  href: string;
  labelKey: string;
  icon: LucideIcon;
  children?: { href: string; labelKey: string }[];
};

const navItems: NavItem[] = [
  { href: "/", labelKey: "home", icon: Home },
  {
    href: "/game",
    labelKey: "game",
    icon: Play,
    children: [
      { href: "/game/artists", labelKey: "artists" },
      { href: "/game/albums", labelKey: "albums" },
      { href: "/game/tracks", labelKey: "tracks" },
    ],
  },
  { href: "/leaderboard", labelKey: "leaderboard", icon: Trophy },
];

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
          <SidebarMenuItem>
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
              <span className="text-xl font-bold group-data-[collapsible=icon]:hidden">
                {t("appName")}
              </span>
            </Link>
          </SidebarMenuItem>
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
              {navItems.map((item) => {
                const Icon = item.icon;
                if (!item.children) {
                  return (
                    <SidebarMenuItem key={item.href}>
                      <Link
                        href={item.href}
                        title={t(item.labelKey)}
                        data-sidebar="menu-button"
                        data-size="default"
                        data-active="false"
                        className={menuButtonClass}
                      >
                        <Icon aria-hidden="true" />
                        <span className="group-data-[collapsible=icon]:hidden">
                          {t(item.labelKey)}
                        </span>
                      </Link>
                    </SidebarMenuItem>
                  );
                }
                return (
                  <Collapsible
                    key={item.href}
                    defaultOpen
                    className="group/collapsible"
                  >
                    <SidebarMenuItem>
                      <div className="flex items-center">
                        <Link
                          href={item.href}
                          title={t(item.labelKey)}
                          data-sidebar="menu-button"
                          data-size="default"
                          data-active="false"
                          className={`${menuButtonClass} flex-1`}
                        >
                          <Icon aria-hidden="true" />
                          <span className="group-data-[collapsible=icon]:hidden">
                            {t(item.labelKey)}
                          </span>
                        </Link>
                        <CollapsibleTrigger
                          asChild
                          className="group-data-[collapsible=icon]:hidden"
                        >
                          <SidebarMenuButton className="w-auto px-1">
                            <ChevronRight
                              className="transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"
                              aria-hidden="true"
                            />
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                      </div>
                      <CollapsibleContent className="group-data-[collapsible=icon]:hidden">
                        <SidebarMenuSub>
                          {item.children.map((child) => (
                            <SidebarMenuSubItem key={child.href}>
                              <Link
                                href={child.href}
                                title={t(child.labelKey)}
                                data-sidebar="menu-sub-button"
                                data-size="sm"
                                data-active="false"
                                className="flex h-7 min-w-0 -translate-x-px items-center gap-2 overflow-hidden rounded-md px-2 text-xs text-sidebar-foreground outline-none ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground"
                              >
                                <span>{t(child.labelKey)}</span>
                              </Link>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                );
              })}
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
