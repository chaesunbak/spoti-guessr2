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
    <Sidebar collapsible="icon" className="@container">
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

        <SidebarTrigger title="Toggle Sidebar" />
      </SidebarHeader>
      <SidebarContent className="flex flex-col justify-between">
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild title="Home">
                  <Link href="/">
                    <Home />
                    <span>Home</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <Collapsible defaultOpen className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton asChild title="Game">
                      <Link href="/game">
                        <Play />
                        <span>Game</span>
                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      </Link>
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild title="Artists">
                          <Link href="/game/artists">
                            <span>Artists</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </CollapsibleContent>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild title="Albums">
                          <Link href="/game/albums">
                            <span>Albums</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </CollapsibleContent>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild title="Tracks">
                          <Link href="/game/tracks">
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
        <footer className="border-t border-border/90 p-2 text-muted-foreground">
          <div className="space-y-2 text-xs font-normal">
            <div className="flex flex-col gap-1">
              <Link href="/terms" className="hover:text-foreground">
                Terms of Service
              </Link>
              <Link href="/privacy" className="hover:text-foreground">
                Privacy Policy
              </Link>
              <a
                href="https://github.com/your-repo"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground"
              >
                Source Code
              </a>
            </div>

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
