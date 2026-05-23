import { Music, Mic, Disc } from "lucide-react";
import { Link } from "@/i18n/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ALLOWED_MODES } from "@/types/game";
import type { GameMode } from "@/types/game";
import { cn } from "@/lib/utils";
import { getTranslations } from "next-intl/server";

export default async function GamePage() {
  const t = await getTranslations("game");

  return (
    <div className="flex flex-1 flex-col gap-2 p-4 lg:gap-4" role="main">
      <h1 id="page-title">{t("selectMode")}</h1>
      <nav
        className="grid auto-rows-min gap-2 md:grid-cols-3 lg:gap-4"
        aria-labelledby="page-title"
      >
        {ALLOWED_MODES.map((mode) => (
          <GameModeCard
            key={mode}
            mode={mode as GameMode}
            title={t(
              `${mode}Title` as "artistsTitle" | "albumsTitle" | "tracksTitle",
            )}
            description={t(
              `${mode}Description` as
                | "artistsDescription"
                | "albumsDescription"
                | "tracksDescription",
            )}
          />
        ))}
      </nav>
    </div>
  );
}

const gameModeIcons = {
  artists: Mic,
  albums: Disc,
  tracks: Music,
} as const;

const gameModeGradients = {
  artists: "bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500",
  albums: "bg-gradient-to-br from-blue-500 via-indigo-500 to-violet-500",
  tracks: "bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500",
} as const;

interface GameModeCardProps {
  mode: GameMode;
  title: string;
  description: string;
}

function GameModeCard({ mode, title, description }: GameModeCardProps) {
  const Icon = gameModeIcons[mode];
  const gradient = gameModeGradients[mode];

  return (
    <Link
      href={`/game/${mode}`}
      className="group relative block aspect-video rounded-xl opacity-90 transition-all duration-300 hover:opacity-100 md:aspect-square"
      aria-label={`Play ${title.toLowerCase()} mode: ${description}`}
    >
      <Card
        className={cn("relative h-full transition-all duration-300", gradient)}
      >
        <CardHeader className="flex flex-row items-center gap-4 p-6">
          <div
            className="rounded-lg bg-white/10 p-2 backdrop-blur-sm"
            aria-hidden="true"
          >
            <Icon className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-white">
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 pt-0">
          <CardDescription className="text-lg text-white/80">
            {description}
          </CardDescription>
        </CardContent>
      </Card>
    </Link>
  );
}
