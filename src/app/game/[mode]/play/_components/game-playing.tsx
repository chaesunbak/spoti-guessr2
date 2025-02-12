"use client";

import { useState, useEffect, useRef } from "react";
import { GameMode, GameGenre } from "@/types/game";
import { Button } from "@/components/ui/button";
import { GameCard } from "./game-card";
import { useRandomGameData } from "@/hooks/use-random-game-data";
import { motion, animate, useMotionValue, useTransform } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { XIcon, Heart, Flame, Crown } from "lucide-react";
import { useBeforeUnload } from "@/hooks/use-before-unload";
import Image from "next/image";

interface GamePlayingProps {
  mode: GameMode;
  genre: GameGenre;
  onScore: (points: number) => void;
  onEnd: () => void;
}

function PopularityCounter({
  to,
  isWinner,
}: {
  to: number;
  isWinner: boolean;
}) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, Math.round);

  useEffect(() => {
    count.set(0);
    const controls = animate(count, to, { duration: 2 });
    return () => controls.stop();
  }, [to]);

  return (
    <div className="flex items-center gap-2">
      {isWinner && (
        <motion.span
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 2 }}
          className="text-yellow-500"
        >
          <Crown className="h-6 w-6" />
        </motion.span>
      )}
      <motion.span className="font-bold">{rounded}</motion.span>

      <span>points</span>
    </div>
  );
}

export function GamePlaying({ mode, genre, onScore, onEnd }: GamePlayingProps) {
  const { data, isPending, isError, error, refetch } = useRandomGameData(
    mode,
    genre,
  );
  const [currentRound, setCurrentRound] = useState(0);
  const [isCheckingAnswer, setIsCheckingAnswer] = useState(false);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [showGameOver, setShowGameOver] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<{
    isCorrect: boolean;
    showNextRound: boolean;
  } | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [showEndGameConfirm, setShowEndGameConfirm] = useState(false);

  //Warn when user try to leave the page
  useBeforeUnload(!showGameOver);

  //Play audio when answer is checking
  useEffect(() => {
    if (isCheckingAnswer && data) {
      const winner =
        data[0].popularity > data[1].popularity ? data[0] : data[1];
      if (audioRef.current && winner.preview_url) {
        audioRef.current.src = winner.preview_url;
        audioRef.current.play().catch(console.error);
      }
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    }
  }, [isCheckingAnswer, data]);

  //Show loading when data is loading
  if (isPending) {
    return (
      <div className="w-full">
        <div className="flex flex-col items-center gap-4">
          <div className="w-full max-w-7xl">
            <div className="flex animate-pulse flex-col items-center gap-4 rounded-xl bg-black/5 p-6 backdrop-blur-sm md:flex-row md:justify-between">
              <div className="flex items-center gap-4">
                <div className="text-center md:text-left">
                  <div className="mb-2 h-8 w-32 rounded bg-white/10"></div>
                  <div className="h-6 w-64 rounded bg-white/10"></div>
                </div>
              </div>
              <div className="flex items-center gap-8">
                <div className="flex flex-col items-center rounded-lg bg-white/10 px-6 py-3">
                  <div className="mb-2 h-4 w-16 rounded bg-white/10"></div>
                  <div className="h-10 w-10 rounded bg-white/10"></div>
                </div>
                <div className="flex flex-col items-center rounded-lg bg-white/10 px-6 py-3">
                  <div className="mb-2 h-4 w-16 rounded bg-white/10"></div>
                  <div className="h-10 w-10 rounded bg-white/10"></div>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full max-w-7xl space-y-6">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {[0, 1].map((i) => (
                <div
                  key={i}
                  className="aspect-square animate-pulse rounded-xl bg-black/5 p-4 backdrop-blur-sm"
                >
                  <div className="flex h-full w-full flex-col justify-between">
                    <div className="aspect-square w-full rounded-lg bg-white/10"></div>
                    <div className="mt-4 space-y-2">
                      <div className="h-6 w-3/4 rounded bg-white/10"></div>
                      <div className="h-4 w-1/2 rounded bg-white/10"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  //Show error when data is error or not found
  if (isError || !data) {
    return (
      <div className="text-center">
        <p>Failed to load game data</p>
        {error && <p>{error.message}</p>}
        <Button onClick={() => refetch()}>Try Again</Button>
      </div>
    );
  }

  const handleCardClick = (selectedIndex: number) => {
    if (isCheckingAnswer) return;

    const [first, second] = data;
    const isCorrect =
      selectedIndex === 0
        ? first.popularity > second.popularity
        : second.popularity > first.popularity;

    if (isCorrect) {
      const points = 1 + Math.floor(currentStreak / 3); // bonus points for consecutive correct answers
      setCurrentStreak((prev) => {
        const newStreak = prev + 1;
        // recover lives every 5 consecutive correct answers
        if (newStreak % 5 === 0 && lives < 3) {
          setLives((prev) => Math.min(prev + 1, 3));
        }
        return newStreak;
      });
      setTotalScore((prev) => prev + points);
      onScore(points);
    } else {
      setCurrentStreak(0);
      setLives((prev) => {
        const newLives = prev - 1;
        if (newLives <= 0) {
          setShowGameOver(true);
        }
        return newLives;
      });
    }

    setSelectedAnswer({ isCorrect, showNextRound: false });
    setIsCheckingAnswer(true);
  };

  //Handle dialog close
  const handleDialogClose = (open: boolean) => {
    if (!open && selectedAnswer && !selectedAnswer.showNextRound) {
      setSelectedAnswer((prev) => ({ ...prev!, showNextRound: true }));
      setCurrentRound((prev) => prev + 1);
      refetch();
    }
    setIsCheckingAnswer(open);
  };

  const handleEndGameClick = () => {
    setShowEndGameConfirm(true);
  };

  //Handle end game confirm
  const handleEndGameConfirm = (confirmed: boolean) => {
    setShowEndGameConfirm(false);
    if (confirmed) {
      onEnd();
    }
  };

  return (
    <div className="w-full">
      <audio ref={audioRef} className="hidden" />
      <div className="flex flex-col items-center gap-4">
        <div className="w-full max-w-7xl">
          {/* Game Info */}
          <div className="flex flex-col items-start justify-between gap-2 rounded-xl bg-muted p-4 backdrop-blur-sm md:gap-4 lg:flex-row lg:items-center lg:gap-8 lg:p-6">
            {/* Round Info */}
            <div className="flex w-full items-center gap-4">
              <div className="flex flex-col gap-2 text-left">
                <motion.h2
                  key={currentRound}
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                >
                  Round {currentRound + 1}
                </motion.h2>

                <div className="flex items-center gap-2">
                  <p className="text-muted-foreground">
                    Choose the more popular {mode} on
                  </p>
                  <Image
                    src="/spotify-logo.png"
                    alt="Spotify"
                    width={80}
                    height={24}
                    className="relative -top-[1px]"
                  />
                </div>
              </div>
            </div>
            {/* Lives & Score & Streak */}
            <div className="flex w-full items-center justify-between gap-2 md:gap-4 lg:gap-8">
              <div className="flex flex-col items-center rounded-lg bg-white/10">
                <span className="text-xs font-medium tracking-wider text-muted-foreground lg:text-sm">
                  LIVES
                </span>
                <div className="flex items-center gap-1">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <motion.span
                      key={`life-${i}`}
                      initial={
                        i < lives
                          ? { scale: 1.5, opacity: 0 }
                          : { scale: 0.5, opacity: 0.3 }
                      }
                      animate={
                        i < lives
                          ? { scale: 1, opacity: 1 }
                          : { scale: 0.5, opacity: 0.3 }
                      }
                      className="text-red-400"
                    >
                      <Heart
                        className="size-4 md:size-6 lg:size-8"
                        fill={i < lives ? "currentColor" : "none"}
                      />
                    </motion.span>
                  ))}
                </div>
              </div>
              <div className="flex flex-col items-center rounded-lg bg-white/10">
                <span className="text-xs font-medium tracking-wider text-muted-foreground lg:text-sm">
                  SCORE
                </span>
                <motion.span
                  key={totalScore}
                  initial={{ scale: 1.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-lg font-bold md:text-2xl lg:text-3xl"
                >
                  {totalScore}
                </motion.span>
              </div>
              <div className="flex flex-col items-center rounded-lg bg-white/10">
                <span className="text-xs font-medium tracking-wider text-muted-foreground lg:text-sm">
                  STREAK
                </span>
                <div className="flex items-center gap-2">
                  <motion.span
                    key={currentStreak}
                    initial={{ scale: 1.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-lg font-bold md:text-2xl lg:text-3xl"
                  >
                    {currentStreak}
                  </motion.span>
                  {currentStreak > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="text-lg font-bold md:text-2xl lg:text-3xl"
                    >
                      <Flame className="size-4 md:size-6 lg:size-8" />
                    </motion.span>
                  )}
                </div>
              </div>
              <Button
                variant="secondary"
                size="icon"
                className="rounded-full transition-colors hover:bg-destructive hover:text-destructive-foreground"
                onClick={handleEndGameClick}
              >
                <XIcon className="h-4 w-4" />
                <span className="sr-only">End Game</span>
              </Button>
            </div>
          </div>
        </div>
        <div className="w-full max-w-7xl space-y-6">
          <div className="grid grid-cols-2 gap-2 md:gap-4 lg:gap-8">
            {data.map((item, index) => (
              <GameCard
                key={item.id}
                data={item}
                onClick={() => handleCardClick(index)}
              />
            ))}
          </div>
        </div>
      </div>

      <Dialog open={isCheckingAnswer} onOpenChange={handleDialogClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl font-bold">
              {selectedAnswer?.isCorrect ? <>Correct!</> : <>Wrong!</>}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between"
            >
              <span>{data[0].name}</span>
              <PopularityCounter
                to={data[0].popularity}
                isWinner={data[0].popularity > data[1].popularity}
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-center justify-between"
            >
              <span>{data[1].name}</span>
              <PopularityCounter
                to={data[1].popularity}
                isWinner={data[1].popularity > data[0].popularity}
              />
            </motion.div>
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.5 }}
              className="block text-center text-muted-foreground"
            >
              {data[0].popularity > data[1].popularity
                ? `Left song is more popular!`
                : `Right song is more popular!`}
            </motion.span>
          </div>
        </DialogContent>
      </Dialog>

      {/* Game Over Dialog */}
      <Dialog open={showGameOver} onOpenChange={() => {}}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Game Over!</DialogTitle>
            <DialogDescription className="text-lg">
              Final Score: {totalScore}
              <br />
              Max Streak: {currentStreak}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end gap-2">
            <Button onClick={onEnd} className="w-full">
              Back to Main
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={showEndGameConfirm}
        onOpenChange={(open) => !open && handleEndGameConfirm(false)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">End Game</DialogTitle>
            <DialogDescription>
              Are you sure you want to end the game? Your current score is{" "}
              {totalScore} points.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end gap-2">
            <Button
              variant="secondary"
              onClick={() => handleEndGameConfirm(false)}
            >
              Continue
            </Button>
            <Button
              variant="destructive"
              onClick={() => handleEndGameConfirm(true)}
            >
              End Game
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
