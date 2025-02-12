"use client";

import { useState } from "react";
import { GameMode, GameGenre, GameState } from "@/types/game";
import { GameReady } from "@/app/game/[mode]/play/_components/game-ready";
import { GamePlaying } from "@/app/game/[mode]/play/_components/game-playing";
import { GameFinished } from "@/app/game/[mode]/play/_components/game-finished";
import { sendGAEvent } from "@next/third-parties/google";

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
    sessionId: crypto.randomUUID(),
  });

  const startGame = () => {
    setGameState({
      ...gameState,
      status: "playing",
      startTime: new Date(),
      currentRound: 1,
    });

    sendGAEvent("event", "game_started", {
      mode: mode.toString(),
      genre: genre.toString(),
      timestamp: new Date().toISOString(),
      session_id: gameState.sessionId,
      screen_size: `${window.innerWidth}x${window.innerHeight}`,
      language: navigator.language,
      is_mobile: window.innerWidth <= 768,
      theme: document.documentElement.classList.contains("dark")
        ? "dark"
        : "light",
      connection_type:
        typeof (navigator as any).connection?.effectiveType === "string"
          ? (navigator as any).connection.effectiveType
          : "unknown",
    });
  };

  const endGame = () => {
    const endTime = new Date();
    setGameState({
      ...gameState,
      status: "finished",
      endTime,
    });

    sendGAEvent("event", "game_finished", {
      mode: mode.toString(),
      genre: genre.toString(),
      timestamp: new Date().toISOString(),
      session_id: gameState.sessionId,
      score: gameState.score,
      total_rounds: gameState.totalRounds,
      current_round: gameState.currentRound,
      duration: gameState.startTime
        ? endTime.getTime() - gameState.startTime.getTime()
        : 0,
    });
  };

  const restartGame = () => {
    const newSessionId = crypto.randomUUID();

    sendGAEvent("event", "game_restarted", {
      mode: mode.toString(),
      genre: genre.toString(),
      timestamp: new Date().toISOString(),
      session_id: gameState.sessionId,
      previous_score: gameState.score,
      previous_rounds: gameState.currentRound,
    });

    setGameState({
      status: "ready",
      score: 0,
      currentRound: 0,
      totalRounds: Infinity,
      sessionId: newSessionId,
    });
  };

  const updateScore = (points: number) => {
    const newScore = gameState.score + points;
    const newRound = gameState.currentRound + 1;

    setGameState({
      ...gameState,
      score: newScore,
      currentRound: newRound,
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
