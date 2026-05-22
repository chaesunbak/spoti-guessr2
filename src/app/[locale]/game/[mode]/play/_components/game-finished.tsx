import { GameMode, GameGenre } from "@/types/game";
import { Button } from "@/components/ui/button";
import {
  Trophy,
  Clock,
  ArrowRight,
  RotateCcw,
  Home,
  Share2,
} from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

interface GameFinishedProps {
  mode: GameMode;
  genre: GameGenre;
  score: number;
  currentRound: number;
  startTime?: Date;
  endTime?: Date;
  onRestart: () => void;
}

export function GameFinished({
  mode,
  genre,
  score,
  currentRound,
  startTime,
  endTime,
  onRestart,
}: GameFinishedProps) {
  const t = useTranslations("gameFinished");
  const [isSharing, setIsSharing] = useState(false);
  const { toast } = useToast();

  const gameDuration =
    startTime && endTime
      ? Math.floor((endTime.getTime() - startTime.getTime()) / 1000)
      : 0;

  const minutes = Math.floor(gameDuration / 60);
  const seconds = gameDuration % 60;
  const averageScore = Math.round(score / currentRound);
  const timeStr = `${minutes}:${seconds.toString().padStart(2, "0")}`;

  const handleShare = async () => {
    setIsSharing(true);
    try {
      const shareText = t("shareText", {
        score,
        rounds: currentRound,
        time: timeStr,
        avg: averageScore,
        mode,
        genre,
      });

      if (navigator.share) {
        await navigator.share({
          title: t("shareTitle"),
          text: shareText,
        });
        toast({
          title: t("shareThanks"),
          description: t("shareThankDesc"),
          duration: 2000,
        });
      } else {
        await navigator.clipboard.writeText(shareText);
        toast({
          title: t("shareCopied"),
          description: t("shareCopiedDesc"),
          duration: 2000,
        });
      }
    } catch {
      toast({
        title: t("shareFailed"),
        description: t("shareFailedDesc"),
        duration: 2000,
        variant: "destructive",
      });
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <div
      className="flex flex-col items-center gap-6 p-4 md:gap-8 md:py-12"
      role="region"
      aria-label="Game results"
    >
      <h2 role="status" aria-label="Game finished">
        {t("gameOver")}
      </h2>

      <div
        className="grid w-full max-w-3xl grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 lg:gap-6"
        role="group"
        aria-label="Game statistics"
      >
        <div
          className="flex flex-row items-center justify-between gap-2 rounded-lg bg-muted p-4 sm:flex-col sm:justify-center md:p-6"
          role="status"
          aria-label={`Final score: ${score} points`}
        >
          <div className="flex flex-row items-center gap-2 sm:flex-col">
            <Trophy
              className="h-6 w-6 text-yellow-500 md:h-8 md:w-8"
              aria-hidden="true"
            />
            <span className="text-sm text-muted-foreground">
              {t("finalScore")}
            </span>
          </div>
          <span className="text-2xl font-bold md:text-3xl">{score}</span>
        </div>

        <div
          className="flex flex-row items-center justify-between gap-2 rounded-lg bg-muted p-4 sm:flex-col sm:justify-center md:p-6"
          role="status"
          aria-label={`Rounds played: ${currentRound}`}
        >
          <div className="flex flex-row items-center gap-2 sm:flex-col">
            <ArrowRight
              className="h-6 w-6 text-blue-500 md:h-8 md:w-8"
              aria-hidden="true"
            />
            <span className="text-sm text-muted-foreground">
              {t("roundsPlayed")}
            </span>
          </div>
          <span className="text-2xl font-bold md:text-3xl">{currentRound}</span>
        </div>

        <div
          className="col-span-1 flex flex-row items-center justify-between gap-2 rounded-lg bg-muted p-4 sm:col-span-2 sm:flex-col sm:justify-center md:col-span-1 md:p-6"
          role="status"
          aria-label={`Time played: ${minutes} minutes and ${seconds} seconds`}
        >
          <div className="flex flex-row items-center gap-2 sm:flex-col">
            <Clock
              className="h-6 w-6 text-green-500 md:h-8 md:w-8"
              aria-hidden="true"
            />
            <span className="text-sm text-muted-foreground">
              {t("timePlayed")}
            </span>
          </div>
          <span className="text-2xl font-bold md:text-3xl">{timeStr}</span>
        </div>
      </div>

      <div
        className="w-full max-w-3xl space-y-2 px-4 text-left lg:text-center"
        role="region"
        aria-label="Additional statistics"
      >
        <div
          className="grid grid-cols-1 gap-4 rounded-lg bg-muted p-4 text-muted-foreground sm:grid-cols-3"
          role="list"
        >
          <p role="listitem">
            {t("averageScore")}:{" "}
            <span className="font-bold">{averageScore}</span>
          </p>
          <p role="listitem">
            {t("mode")}:{" "}
            <span className="font-bold capitalize">{mode}</span>
          </p>
          <p role="listitem">
            {t("genre")}: <span className="font-bold">{genre}</span>
          </p>
        </div>
      </div>

      <div
        className="grid w-full max-w-3xl grid-cols-1 gap-3 px-4 sm:grid-cols-3 sm:gap-4"
        role="group"
        aria-label="Game actions"
      >
        <Button
          size="lg"
          onClick={onRestart}
          className="flex items-center justify-center gap-2"
          aria-label="Play another game with same settings"
        >
          <RotateCcw className="h-5 w-5" aria-hidden="true" />
          {t("playAgain")}
        </Button>

        <Button
          size="lg"
          variant="secondary"
          className="flex items-center justify-center gap-2"
          onClick={handleShare}
          disabled={isSharing}
          aria-label="Share your game results"
        >
          <Share2 className="h-5 w-5" aria-hidden="true" />
          {t("shareResults")}
        </Button>

        <Button size="lg" variant="secondary" asChild>
          <Link
            href="/game"
            className="flex items-center justify-center gap-2"
            aria-label="Return to game mode selection"
          >
            <Home className="h-5 w-5" aria-hidden="true" />
            {t("chooseMode")}
          </Link>
        </Button>
      </div>
    </div>
  );
}
