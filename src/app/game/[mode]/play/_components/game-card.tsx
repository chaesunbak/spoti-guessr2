"use client";

import { useState, useRef, useEffect } from "react";
import { Play, Pause, X, AlertCircle } from "lucide-react";
import clsx from "clsx";
import type { GameItem } from "@/types/game";
import { Progress } from "@/components/ui/progress";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { useMuteStore } from "@/stores/use-mute-store";

interface GameCardProps {
  data: GameItem;
  onClick?: () => void;
  tabIndex?: number;
  autoFocus?: boolean;
  onKeyDown?: (e: React.KeyboardEvent<HTMLDivElement>) => void;
  "data-card-index"?: number;
  "aria-label"?: string;
  isPreviewPlaying?: boolean;
  onPreviewStateChange?: (isPlaying: boolean) => void;
  audioRef?: React.RefObject<HTMLAudioElement>;
}

export function GameCard({
  data,
  onClick,
  tabIndex = 0,
  autoFocus,
  onKeyDown,
  "data-card-index": dataCardIndex,
  "aria-label": ariaLabel,
  isPreviewPlaying,
  onPreviewStateChange,
  audioRef,
}: GameCardProps) {
  const [userPaused, setUserPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const { isMuted } = useMuteStore();

  const imageRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    if (audioRef?.current) {
      audioRef.current.muted = isMuted;
    }
  }, [isMuted, audioRef]);

  const togglePlay = async (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!audioRef?.current || !data.preview_url) return;

    if (isPreviewPlaying) {
      audioRef.current.pause();
      onPreviewStateChange?.(false);
      setUserPaused(true);
    } else {
      try {
        audioRef.current.src = data.preview_url;
        await audioRef.current.play();
        onPreviewStateChange?.(true);
        setUserPaused(false);
      } catch (err) {
        console.error("Audio playback failed:", err);
      }
    }
  };

  const handleMouseEnter = async () => {
    if (
      !audioRef?.current ||
      isPreviewPlaying ||
      userPaused ||
      !data.preview_url
    )
      return;
    try {
      audioRef.current.src = data.preview_url;
      await audioRef.current.play();
      onPreviewStateChange?.(true);
    } catch (err) {
      console.error("Auto-play failed:", err);
    }
  };

  const handleMouseLeave = () => {
    if (!audioRef?.current || !isPreviewPlaying || userPaused) return;
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    onPreviewStateChange?.(false);
  };

  const updateProgress = () => {
    if (audioRef?.current) {
      const { currentTime, duration } = audioRef.current;
      setProgress((currentTime / duration) * 100);
    }
  };

  // Add event listener for audio ended
  useEffect(() => {
    const audio = audioRef?.current;
    if (!audio) return;

    const handleEnded = () => {
      setUserPaused(true);
      audio.currentTime = 0;
    };

    audio.addEventListener("ended", handleEnded);
    return () => {
      audio.removeEventListener("ended", handleEnded);
    };
  }, [audioRef]);

  return (
    <Card
      className="group relative flex max-h-[22rem] cursor-pointer flex-col justify-between overflow-hidden rounded-xl p-3 opacity-100 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:max-h-none md:p-4 lg:p-5"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      role="button"
      tabIndex={tabIndex}
      autoFocus={autoFocus}
      onKeyDown={onKeyDown}
      data-card-index={dataCardIndex}
      aria-label={ariaLabel || `Select ${data.name}`}
    >
      {/* Background Image with Blur */}
      <div
        className="animate-slow-spin absolute inset-0 z-10"
        style={{
          backgroundImage: `url(${data.image})`,
          backgroundSize: "contain",
          backgroundPosition: "center",
          filter: "blur(30px) grayscale(10%)",
          transform: "scale(1.8)",
        }}
        aria-hidden="true"
      />
      <div
        className="relative flex aspect-square max-h-96 w-full items-center justify-center"
        role="img"
        aria-label={`Album artwork for ${data.name}`}
      >
        <Image
          ref={imageRef as any}
          className="absolute left-1/2 top-1/2 z-20 h-auto max-h-[150px] w-auto max-w-[150px] -translate-x-1/2 -translate-y-1/2 transform rounded-md object-contain shadow-md transition duration-200 sm:max-h-[175px] sm:max-w-[175px] md:max-h-[200px] md:max-w-[200px] md:shadow-lg lg:max-h-[250px] lg:max-w-[250px]"
          src={data.image}
          alt={`Album artwork for ${data.name}`}
          width={250}
          height={250}
          unoptimized={true}
          crossOrigin="anonymous"
        />
      </div>
      <div className="z-20">
        <div className="z-20 size-fit text-base font-bold md:text-xl lg:text-3xl">
          {"explicit" in data && data.explicit && (
            <AlertCircle
              className="z-20 mr-1 inline-block h-4 w-4"
              role="img"
              aria-label="Explicit content"
            />
          )}

          <span
            className="z-20 size-fit text-base font-bold text-white md:text-xl lg:text-2xl"
            role="heading"
            aria-level={3}
          >
            {data.name}
          </span>
        </div>
      </div>
      {data.preview_url && (
        <audio
          ref={audioRef}
          className="hidden"
          controls
          src={data.preview_url}
          onTimeUpdate={updateProgress}
          aria-label={`Audio preview for ${data.name}`}
        />
      )}
      <div
        className="z-20 my-2 grid grid-cols-5 text-xl text-white md:my-3 md:text-2xl lg:my-4 lg:text-3xl"
        role="region"
        aria-label="Audio controls"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.2 }}
          className="relative col-start-3 m-auto aspect-square rounded-full p-2 transition-colors duration-200 hover:bg-white/20 md:p-3 lg:p-4"
          onClick={(e) => {
            e.stopPropagation();
            togglePlay();
          }}
          role="button"
          tabIndex={0}
          aria-label={
            !data.preview_url
              ? "No audio preview available"
              : isPreviewPlaying
                ? "Pause"
                : "Play"
          }
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              togglePlay();
            }
          }}
        >
          <AnimatePresence mode="wait" initial={false}>
            {!data.preview_url ? (
              <motion.div
                key="no-preview"
                initial={{ opacity: 0, scale: 0.3 }}
                animate={{
                  opacity: 1,
                  scale: [0.3, 1.2, 1],
                }}
                exit={{ opacity: 0, scale: 0.3 }}
                transition={{
                  duration: 0.4,
                  ease: [0.175, 0.885, 0.32, 1.275],
                  scale: {
                    times: [0, 0.6, 1],
                  },
                }}
                className="absolute inset-0 flex items-center justify-center"
                aria-hidden="true"
              >
                <X />
              </motion.div>
            ) : isPreviewPlaying ? (
              <motion.div
                key="pause"
                initial={{ opacity: 0, scale: 0.3 }}
                animate={{
                  opacity: 1,
                  scale: [0.3, 1.2, 1],
                }}
                exit={{ opacity: 0, scale: 0.3 }}
                transition={{
                  duration: 0.4,
                  ease: [0.175, 0.885, 0.32, 1.275],
                  scale: {
                    times: [0, 0.6, 1],
                  },
                }}
                className="absolute inset-0 flex items-center justify-center"
                aria-hidden="true"
              >
                <Pause />
              </motion.div>
            ) : (
              <motion.div
                key="play"
                initial={{ opacity: 0, scale: 0.3 }}
                animate={{
                  opacity: 1,
                  scale: [0.3, 1.2, 1],
                }}
                exit={{ opacity: 0, scale: 0.3 }}
                transition={{
                  duration: 0.4,
                  ease: [0.175, 0.885, 0.32, 1.275],
                  scale: {
                    times: [0, 0.6, 1],
                  },
                }}
                className="absolute inset-0 flex items-center justify-center"
                aria-hidden="true"
              >
                <Play />
              </motion.div>
            )}
          </AnimatePresence>
          <div className="invisible" aria-hidden="true">
            <Play />
          </div>
        </motion.div>
      </div>

      <Progress
        value={progress}
        className="z-20 h-2"
        aria-label={`Audio progress: ${Math.round(progress)}%`}
      />
    </Card>
  );
}
