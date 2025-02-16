"use client";

import { useRef, useEffect } from "react";
import { AlertCircle } from "lucide-react";
import type { GameItem } from "@/types/game";
import { Progress } from "@/components/ui/progress";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { useAudioPlayer } from "@/hooks/use-audio-player";
import { AudioControlButton } from "@/app/game/[mode]/play/_components/audio-control-button";
import { useMuteStore } from "@/components/providers/mute-store-provider";

interface GameCardProps {
  data: GameItem;
  index: number;
  isPlaying: boolean;
  setPlayingCardIndex: (index: number | null) => void;
  onClick?: () => void;
  tabIndex?: number;
  autoFocus?: boolean;
  onKeyDown?: (e: React.KeyboardEvent<HTMLDivElement>) => void;
  "data-card-index"?: number;
  "aria-label"?: string;
}

export function GameCard({
  data,
  index,
  isPlaying,
  setPlayingCardIndex,
  onClick,
  tabIndex = 0,
  autoFocus,
  onKeyDown,
  "data-card-index": dataCardIndex,
  "aria-label": ariaLabel,
}: GameCardProps) {
  const { isMuted } = useMuteStore((state) => state);

  const imageRef = useRef<HTMLImageElement | null>(null);

  const {
    audioRef,
    progress,
    togglePlay,
    onMouseEnter,
    onMouseLeave,
    paused,
    setPaused,
  } = useAudioPlayer({
    url: data.preview_url ?? null,
    isPlaying,
    onPlayStateChange: (playing) => {
      setPlayingCardIndex(playing ? index : null);
    },
  });

  //Mute audio if user is muted
  useEffect(() => {
    if (audioRef?.current) {
      audioRef.current.muted = isMuted;
    }
  }, [isMuted, audioRef]);

  return (
    <Card
      className="group relative flex max-h-[22rem] cursor-pointer flex-col justify-between overflow-hidden rounded-xl p-3 opacity-100 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:max-h-none md:p-4 lg:p-5"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
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
        className="absolute inset-0 z-10 animate-slow-spin"
        style={{
          backgroundImage: `url(${data.image})`,
          backgroundSize: "contain",
          backgroundPosition: "center",
          filter: "blur(35px) grayscale(15%)",
          transform: "scale(1.9)",
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
          preload="auto"
          aria-label={`Audio preview for ${data.name}`}
        />
      )}
      <AudioControlButton
        previewUrl={data.preview_url ?? null}
        isPlaying={isPlaying}
        paused={paused}
        setPaused={setPaused}
        togglePlay={togglePlay}
      />

      <Progress
        value={progress}
        className="z-20 h-2"
        aria-label={`Audio progress: ${Math.round(progress)}%`}
      />
    </Card>
  );
}
