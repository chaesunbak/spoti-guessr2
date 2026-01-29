import type { Metadata } from "next";
import "@/app/globals.css";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/app/_components/app-sidebar";
import { AppHeader } from "@/app/_components/app-header";
import { ThemeProvider } from "@/components/providers/theme-provider";
import QueryClinetProvider from "@/components/providers/query-client-provider";
import { cookies } from "next/headers";
import { Toaster } from "@/components/ui/toaster";
import { GoogleAnalytics } from "@next/third-parties/google";
import { MuteStoreProvider } from "@/components/providers/mute-store-provider";
import { AuthStoreProvider } from "@/components/providers/auth-store-provider";

export const metadata: Metadata = {
  title: {
    default: "Spoti-Guessr | Guess What's trending on Spotify",
    template: "%s | Spoti-Guessr",
  },
  description:
    "Compare songs, artists, and albums to guess which one is more popular on Spotify. Test your knowledge of music trends and compete for high scores!",
  keywords: [
    "Spotify",
    "music game",
    "K-pop",
    "music quiz",
    "popularity game",
    "music trends",
    "Spotify game",
    "higher or lower",
  ],
  authors: [{ name: "Chaesunbak" }],
  creator: "Chaesunbak",
  publisher: "Chaesunbak",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://spoti-guessr.vercel.app",
    title: "Spoti-Guessr | Guess What's trending on Spotify",
    description:
      "Compare songs, artists, and albums to guess which one is more popular on Spotify. Test your knowledge of music trends!",
    siteName: "Spoti-Guessr",
  },
  twitter: {
    card: "summary_large_image",
    title: "Spoti-Guessr | Guess What's trending on Spotify",
    description:
      "Compare songs, artists, and albums to guess which one is more popular on Spotify. Test your knowledge of music trends!",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  verification: {
    google: "SxEa7QUIpH9WaCtiGhpur2C-iEQDwfoIfFvGOzD2RzY",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  const GA_ID = process.env.NEXT_PUBLIC_GID;

  return (
    <html lang="en" suppressHydrationWarning>
      {GA_ID && <GoogleAnalytics gaId={GA_ID} />}
      <body className="bg-background text-foreground antialiased">
        {/* IF TOO MAN PROVIDERS, CHAGNE TO GLOBAL PROVIDERS */}
        <QueryClinetProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <AuthStoreProvider>
              <MuteStoreProvider>
                <SidebarProvider defaultOpen={defaultOpen}>
                  <AppSidebar />
                  <div className="w-full">
                    <AppHeader />
                    <main className="min-h-[calc(100vh-3.5rem)]">
                      {children}
                    </main>
                    <Toaster />
                  </div>
                </SidebarProvider>
              </MuteStoreProvider>
            </AuthStoreProvider>
          </ThemeProvider>
        </QueryClinetProvider>
        <script async src="https://utmate.me/sdk/utmate-sdk.iife.js"></script>
      </body>
    </html>
  );
}
