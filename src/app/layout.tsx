import type { Metadata } from "next";
import "@/app/globals.css";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/app/_components/app-sidebar";
import { AppHeader } from "@/app/_components/app-header";
import { ThemeProvider } from "@/components/providers/theme-provider";
import QueryClinetProvider from "@/components/providers/query-client-provider";
import { cookies } from "next/headers";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "Spoti-Guessr : Guess Higher or Lower",
  description: "Music Popularity Guess Game",
  icons: {
    icon: "/favicon.ico",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-background text-foreground antialiased">
        {/* IF TOO MAN PROVIDERS, CHAGNE TO GLOBAL PROVIDERS */}
        <QueryClinetProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <SidebarProvider defaultOpen={defaultOpen}>
              <AppSidebar />
              <div className="w-full">
                <AppHeader />
                <main className="h-full">{children}</main>
                <Toaster />
              </div>
            </SidebarProvider>
          </ThemeProvider>
        </QueryClinetProvider>
      </body>
    </html>
  );
}
