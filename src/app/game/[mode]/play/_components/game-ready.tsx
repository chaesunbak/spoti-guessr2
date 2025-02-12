import { GameMode, GameGenre } from "@/types/game";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { XIcon, Heart, Play, EyeIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface GameReadyProps {
  mode: GameMode;
  genre: GameGenre;
  onStart: () => void;
}

interface TutorialStep {
  element: string;
  title: string;
  description: string;
  position: "top" | "bottom" | "left" | "right";
}

const tutorialSteps: TutorialStep[] = [
  {
    element: "round-info",
    title: "Round Counter",
    description:
      "Shows your current round number. Each round presents two new items to compare.",
    position: "right",
  },
  {
    element: "lives-display",
    title: "Lives Display",
    description:
      "You start with 3 lives. Lose one for each wrong answer, but gain one for every 5 correct answers in a row!",
    position: "bottom",
  },
  {
    element: "score-display",
    title: "Score Display",
    description:
      "Your total score. Get 1 point for each correct answer, with bonus points for streaks!",
    position: "bottom",
  },
  {
    element: "streak-display",
    title: "Streak Counter",
    description:
      "Your current streak of correct answers. Every 3 correct answers in a row gives bonus points!",
    position: "bottom",
  },
  {
    element: "game-cards",
    title: "Game Cards",
    description:
      "Click on the {mode} you think is more popular. Hover to play its preview audio if available!",
    position: "top",
  },
  {
    element: "end-game-button",
    title: "End Game Button",
    description: "Click to end the game and see your final score and streak.",
    position: "left",
  },
];

const TUTORIAL_STORAGE_KEY = "spoti-guessr-tutorial-completed";

export function GameReady({ mode, genre, onStart }: GameReadyProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [showTutorial, setShowTutorial] = useState(() => {
    const completed = localStorage.getItem(TUTORIAL_STORAGE_KEY);
    return !completed;
  });
  const [tutorialCompleted, setTutorialCompleted] = useState(() => {
    const completed = localStorage.getItem(TUTORIAL_STORAGE_KEY);
    return !!completed;
  });

  useEffect(() => {
    if (currentStep >= tutorialSteps.length) {
      setShowTutorial(false);
      setTutorialCompleted(true);
      localStorage.setItem(TUTORIAL_STORAGE_KEY, "true");
    }
  }, [currentStep]);

  const handleRestartTutorial = () => {
    setCurrentStep(0);
    setShowTutorial(true);
    setTutorialCompleted(false);
    localStorage.removeItem(TUTORIAL_STORAGE_KEY);
  };

  const handleNextStep = () => {
    setCurrentStep((prev) => prev + 1);
  };

  const handleSkipTutorial = () => {
    setShowTutorial(false);
    setTutorialCompleted(true);
    localStorage.setItem(TUTORIAL_STORAGE_KEY, "true");
  };

  const getCurrentTooltip = (elementId: string) => {
    if (currentStep >= tutorialSteps.length) return null;

    const step = tutorialSteps[currentStep];
    if (!showTutorial || step.element !== elementId) return null;

    return (
      <div
        className="space-y-2"
        role="dialog"
        aria-labelledby={`tutorial-title-${elementId}`}
      >
        <h4 id={`tutorial-title-${elementId}`} className="font-semibold">
          {step.title}
        </h4>
        <p className="text-sm">{step.description.replace("{mode}", mode)}</p>
        <div className="flex gap-2 pt-2">
          <Button
            size="sm"
            className="flex-1"
            onClick={handleNextStep}
            aria-label={
              currentStep === tutorialSteps.length - 1
                ? "Finish tutorial"
                : "Next tutorial step"
            }
          >
            {currentStep === tutorialSteps.length - 1 ? "Finish" : "Next"}
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={handleSkipTutorial}
            className="flex-1"
            aria-label="Skip tutorial"
          >
            Skip Tutorial
          </Button>
        </div>
      </div>
    );
  };

  return (
    <TooltipProvider>
      <div
        className="w-full"
        role="region"
        aria-label="Game preparation screen"
      >
        <div className="flex flex-col items-center gap-4">
          <div className="w-full max-w-7xl">
            <div className="flex flex-col items-start justify-between gap-2 rounded-xl bg-muted p-4 backdrop-blur-sm md:gap-4 lg:flex-row lg:items-center lg:gap-8 lg:p-6">
              <div className="flex w-full items-center gap-4">
                <Tooltip open={showTutorial && currentStep === 0}>
                  <TooltipTrigger asChild>
                    <div
                      id="round-info"
                      className="flex flex-col gap-2 text-left"
                      role="status"
                      aria-label="Round information"
                    >
                      <h2>Round</h2>
                      <p className="text-muted-foreground">
                        Choose the more popular {mode} on Spotify
                      </p>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="max-w-xs p-4">
                    {getCurrentTooltip("round-info")}
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className="flex w-full items-center justify-between gap-2 md:gap-4 lg:gap-8">
                <Tooltip open={showTutorial && currentStep === 1}>
                  <TooltipTrigger asChild>
                    <div
                      id="lives-display"
                      className="flex flex-col items-center rounded-lg bg-white/10"
                      role="status"
                      aria-label="Lives remaining: 3"
                    >
                      <span className="text-xs font-medium tracking-wider text-muted-foreground lg:text-sm">
                        LIVES
                      </span>
                      <div
                        className="flex items-center gap-1"
                        aria-hidden="true"
                      >
                        {Array.from({ length: 3 }).map((_, i) => (
                          <Heart
                            key={i}
                            className="size-4 text-primary md:size-6 lg:size-8"
                            fill="currentColor"
                          />
                        ))}
                      </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="max-w-xs p-4">
                    {getCurrentTooltip("lives-display")}
                  </TooltipContent>
                </Tooltip>

                <Tooltip open={showTutorial && currentStep === 2}>
                  <TooltipTrigger asChild>
                    <div
                      id="score-display"
                      className="flex flex-col items-center rounded-lg bg-white/10"
                      role="status"
                      aria-label="Current score: 0"
                    >
                      <span className="text-xs font-medium tracking-wider text-muted-foreground lg:text-sm">
                        SCORE
                      </span>
                      <div className="flex items-center">
                        <span className="text-lg font-bold md:text-2xl lg:text-3xl">
                          0
                        </span>
                      </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="max-w-xs p-4">
                    {getCurrentTooltip("score-display")}
                  </TooltipContent>
                </Tooltip>

                <Tooltip open={showTutorial && currentStep === 3}>
                  <TooltipTrigger asChild>
                    <div
                      id="streak-display"
                      className="flex flex-col items-center rounded-lg bg-white/10"
                      role="status"
                      aria-label="Current streak: 0"
                    >
                      <span className="text-xs font-medium tracking-wider text-muted-foreground lg:text-sm">
                        STREAK
                      </span>
                      <div className="flex items-center">
                        <span className="text-lg font-bold md:text-2xl lg:text-3xl">
                          0
                        </span>
                      </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="max-w-xs p-4">
                    {getCurrentTooltip("streak-display")}
                  </TooltipContent>
                </Tooltip>

                <Tooltip open={showTutorial && currentStep === 5}>
                  <TooltipTrigger asChild>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="rounded-full transition-colors hover:bg-destructive hover:text-destructive-foreground"
                      aria-label="End game"
                    >
                      <XIcon className="h-4 w-4" aria-hidden="true" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="left" className="max-w-xs p-4">
                    {getCurrentTooltip("end-game-button")}
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          </div>
          {!showTutorial && tutorialCompleted ? (
            <div className="w-full max-w-7xl rounded-xl bg-muted backdrop-blur-sm">
              <div className="flex aspect-[2/1] flex-col items-center justify-center gap-4 p-6">
                <h2 className="text-2xl font-bold md:text-3xl">
                  Ready to Play?
                </h2>
                <p className="max-w-lg text-center text-lg text-muted-foreground">
                  Try to get the highest score by correctly guessing which{" "}
                  {mode} is more popular.
                </p>
                <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
                  <Button
                    size="lg"
                    onClick={onStart}
                    className="min-w-[200px]"
                    aria-label="Start playing the game"
                  >
                    <Play className="h-5 w-5" aria-hidden="true" />
                    Start Game
                  </Button>
                  <Button
                    variant="secondary"
                    size="lg"
                    onClick={handleRestartTutorial}
                    className="min-w-[200px]"
                    aria-label="View the tutorial again"
                  >
                    <EyeIcon className="h-5 w-5" aria-hidden="true" />
                    View Tutorial Again
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <Tooltip open={showTutorial && currentStep === 4}>
              <TooltipTrigger asChild>
                <div
                  id="game-cards"
                  className="w-full max-w-7xl"
                  role="region"
                  aria-label="Game preview"
                >
                  <div className="grid grid-cols-2 gap-2 md:gap-4 lg:gap-8">
                    <div
                      className="flex aspect-square items-center justify-center rounded-xl bg-muted backdrop-blur-sm"
                      aria-label={`First ${mode} preview card`}
                    >
                      <p className="text-xl text-muted-foreground">
                        First {mode}
                      </p>
                    </div>
                    <div
                      className="flex aspect-square items-center justify-center rounded-xl bg-muted backdrop-blur-sm"
                      aria-label={`Second ${mode} preview card`}
                    >
                      <p className="text-xl capitalize text-muted-foreground">
                        Second {mode}
                      </p>
                    </div>
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-xs p-4">
                {getCurrentTooltip("game-cards")}
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
}
