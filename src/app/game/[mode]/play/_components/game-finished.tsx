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
import Link from "next/link";

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
  const [isSharing, setIsSharing] = useState(false);
  const { toast } = useToast();

  // calculate game duration
  const gameDuration =
    startTime && endTime
      ? Math.floor((endTime.getTime() - startTime.getTime()) / 1000)
      : 0;

  const minutes = Math.floor(gameDuration / 60);
  const seconds = gameDuration % 60;

  // calculate average score
  const averageScore = Math.round(score / currentRound);

  // create text to share
  const getShareText = () => {
    return (
      `🎮 Spoti-Guessr Results\n\n` +
      `🏆 Score: ${score}\n` +
      `🎯 Rounds: ${currentRound}\n` +
      `⌛ Time: ${minutes}:${seconds.toString().padStart(2, "0")}\n` +
      `📊 Avg Score: ${averageScore}\n` +
      `🎵 Mode: ${mode}\n` +
      `🎸 Genre: ${genre}\n\n` +
      `Play now at https://spoti-guessr.com`
    );
  };

  // 결과 공유하기
  const handleShare = async () => {
    setIsSharing(true);
    try {
      const shareText = getShareText();

      // check if navigator.share is supported
      if (navigator.share) {
        await navigator.share({
          title: "Spoti-Guessr Results",
          text: shareText,
        });
        toast({
          title: "Thanks for sharing!",
          description: "Your friends will love it!",
          duration: 2000,
        });
      } else {
        // if navigator.share is not supported, copy to clipboard
        await navigator.clipboard.writeText(shareText);
        toast({
          title: "Results copied to clipboard!",
          description: "You can paste it anywhere you want.",
          duration: 2000,
        });
      }
    } catch (error) {
      toast({
        title: "Failed to share results",
        description: "Please try again.",
        duration: 2000,
        variant: "destructive",
      });
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 p-4 md:gap-8 md:py-12">
      <h2>Game Over!</h2>

      {/* Stats Cards */}
      <div className="grid w-full max-w-3xl grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 lg:gap-6">
        {/* Final Score */}
        <div className="flex flex-row items-center justify-between gap-2 rounded-lg bg-muted p-4 sm:flex-col sm:justify-center md:p-6">
          <div className="flex flex-row items-center gap-2 sm:flex-col">
            <Trophy className="h-6 w-6 text-yellow-500 md:h-8 md:w-8" />
            <span className="text-sm text-muted-foreground">Final Score</span>
          </div>
          <span className="text-2xl font-bold md:text-3xl">{score}</span>
        </div>

        {/* Rounds Played */}
        <div className="flex flex-row items-center justify-between gap-2 rounded-lg bg-muted p-4 sm:flex-col sm:justify-center md:p-6">
          <div className="flex flex-row items-center gap-2 sm:flex-col">
            <ArrowRight className="h-6 w-6 text-blue-500 md:h-8 md:w-8" />
            <span className="text-sm text-muted-foreground">Rounds Played</span>
          </div>
          <span className="text-2xl font-bold md:text-3xl">{currentRound}</span>
        </div>

        {/* Time Played */}
        <div className="col-span-1 flex flex-row items-center justify-between gap-2 rounded-lg bg-muted p-4 sm:col-span-2 sm:flex-col sm:justify-center md:col-span-1 md:p-6">
          <div className="flex flex-row items-center gap-2 sm:flex-col">
            <Clock className="h-6 w-6 text-green-500 md:h-8 md:w-8" />
            <span className="text-sm text-muted-foreground">Time Played</span>
          </div>
          <span className="text-2xl font-bold md:text-3xl">
            {minutes}:{seconds.toString().padStart(2, "0")}
          </span>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="w-full max-w-3xl space-y-2 px-4 text-left lg:text-center">
        <div className="grid grid-cols-1 gap-4 rounded-lg bg-muted p-4 text-muted-foreground sm:grid-cols-3">
          <p>
            Average Score: <span className="font-bold">{averageScore}</span>
          </p>
          <p>
            Mode: <span className="font-bold capitalize">{mode}</span>
          </p>
          <p>
            Genre: <span className="font-bold">{genre}</span>
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="grid w-full max-w-3xl grid-cols-1 gap-3 px-4 sm:grid-cols-3 sm:gap-4">
        {/* Restart Game */}
        <Button
          size="lg"
          onClick={onRestart}
          className="flex items-center justify-center gap-2"
        >
          <RotateCcw className="h-5 w-5" />
          Play Again
        </Button>

        {/* Share Results */}
        <Button
          size="lg"
          variant="secondary"
          className="flex items-center justify-center gap-2"
          onClick={handleShare}
          disabled={isSharing}
        >
          <Share2 className="h-5 w-5" />
          Share Results
        </Button>

        {/* Choose Mode */}
        <Button size="lg" variant="secondary" asChild>
          <Link href="/game" className="flex items-center justify-center gap-2">
            <Home className="h-5 w-5" />
            Choose Mode
          </Link>
        </Button>
      </div>
    </div>
  );
}
