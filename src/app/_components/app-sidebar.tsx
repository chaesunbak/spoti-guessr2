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
import Link from "next/link";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import Image from "next/image";

export function AppSidebar() {
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
                    title="Home"
                    aria-label="Go to home page"
                  >
                    <Image
                      src="/logo.png"
                      alt="Spoti-Guessr Logo"
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                    <span className="text-xl font-bold">Spoti-Guessr</span>
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
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild title="Home">
                  <Link href="/" aria-label="Navigate to home page">
                    <Home aria-hidden="true" />
                    <span>Home</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <Collapsible defaultOpen className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton asChild title="Game">
                      <Link href="/game" aria-label="Open game modes menu">
                        <Play aria-hidden="true" />
                        <span>Game</span>
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
                        <SidebarMenuSubButton asChild title="Artists">
                          <Link
                            href="/game/artists"
                            aria-label="Play artists game mode"
                          >
                            <span>Artists</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </CollapsibleContent>
                  <CollapsibleContent>
                    <SidebarMenuSub role="menu" aria-label="Game modes">
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild title="Albums">
                          <Link
                            href="/game/albums"
                            aria-label="Play albums game mode"
                          >
                            <span>Albums</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </CollapsibleContent>
                  <CollapsibleContent>
                    <SidebarMenuSub role="menu" aria-label="Game modes">
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild title="Tracks">
                          <Link
                            href="/game/tracks"
                            aria-label="Play tracks game mode"
                          >
                            <span>Tracks</span>
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
      <SidebarFooter className="@[13rem]:block hidden">
        <footer
          className="border-t border-border/90 p-2 text-muted-foreground"
          role="contentinfo"
          aria-label="Site information"
        >
          <div className="space-y-2 text-xs font-normal">
            <nav className="flex flex-col gap-1" aria-label="Legal links">
              <Link href="/terms" className="hover:text-foreground">
                Terms of Service
              </Link>
              <Link href="/privacy" className="hover:text-foreground">
                Privacy Policy
              </Link>
              <a
                href="https://github.com/chaesunbak/spoti-guessr2"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground"
              >
                Source Code
              </a>
            </nav>

            <p className="text-xs">
              Spoti-Guessr is an open-source project. All game data may differ
              from actual Spotify data.
            </p>

            <div className="pt-2">
              <p className="text-xs">Contact: support@spotiguessr.com</p>
              <p className="pt-2 text-xs">
                Powered by Chaesunbak
                <br />© 2025 Chaesunbak. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </SidebarFooter>
    </Sidebar>
  );
}
