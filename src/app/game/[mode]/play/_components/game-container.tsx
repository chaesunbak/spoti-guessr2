"use client";

import { useState } from "react";
import { GameMode, GameGenre, GameState } from "@/types/game";
import { GameReady } from "@/app/game/[mode]/play/_components/game-ready";
import { GamePlaying } from "@/app/game/[mode]/play/_components/game-playing";
import { GameFinished } from "@/app/game/[mode]/play/_components/game-finished";

interface GameContainerProps {
  mode: GameMode;
  genre: GameGenre;
}

export function GameContainer({ mode, genre }: GameContainerProps) {
  const [gameState, setGameState] = useState<GameState>({
    status: "ready",
    score: 0,
    currentRound: 0,
    totalRounds: Infinity,
  });

  const startGame = () => {
    setGameState({
      ...gameState,
      status: "playing",
      startTime: new Date(),
      currentRound: 1,
    });
  };

  const endGame = () => {
    setGameState({
      ...gameState,
      status: "finished",
      endTime: new Date(),
    });
  };

  const restartGame = () => {
    setGameState({
      status: "ready",
      score: 0,
      currentRound: 0,
      totalRounds: Infinity,
    });
  };

  const updateScore = (points: number) => {
    setGameState({
      ...gameState,
      score: gameState.score + points,
      currentRound: gameState.currentRound + 1,
    });
  };

  return (
    <div className="container mx-auto p-4">
      {gameState.status === "ready" && (
        <GameReady mode={mode} genre={genre} onStart={startGame} />
      )}

      {gameState.status === "playing" && (
        <GamePlaying
          mode={mode}
          genre={genre}
          onScore={updateScore}
          onEnd={endGame}
        />
      )}

      {gameState.status === "finished" && (
        <GameFinished
          mode={mode}
          genre={genre}
          score={gameState.score}
          currentRound={gameState.currentRound}
          startTime={gameState.startTime}
          endTime={gameState.endTime}
          onRestart={restartGame}
        />
      )}
    </div>
  );
}
