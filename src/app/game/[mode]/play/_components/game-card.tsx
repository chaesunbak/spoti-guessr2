"use client";

import { useState, useRef, useEffect } from "react";
import { Play, Pause, X, AlertCircle } from "lucide-react";
import clsx from "clsx";
import type { GameItem } from "@/types/game";
import { Progress } from "@/components/ui/progress";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { useColorPalette } from "@/hooks/use-color-palette";
import { motion, AnimatePresence } from "framer-motion";
import { useMuteStore } from "@/stores/use-mute-store";

interface GameCardProps {
  data: GameItem;
  onClick?: () => void;
}

export function GameCard({ data, onClick }: GameCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const { isMuted } = useMuteStore();

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const { data: colors, loading, error } = useColorPalette(data.image);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
    }
  }, [isMuted]);

  const togglePlay = async (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      setUserPaused(true);
    } else {
      try {
        await audioRef.current.play();
        setIsPlaying(true);
        setUserPaused(false);
      } catch (err) {
        console.error("오디오 재생 실패:", err);
      }
    }
  };

  const handleMouseEnter = async () => {
    if (!audioRef.current || isPlaying || userPaused) return;
    try {
      await audioRef.current.play();
      setIsPlaying(true);
    } catch (err) {
      console.error("오디오 자동 재생 실패:", err);
    }
  };

  const handleMouseLeave = () => {
    if (!audioRef.current || !isPlaying || userPaused) return;
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setIsPlaying(false);
  };

  const updateProgress = () => {
    if (audioRef.current) {
      const { currentTime, duration } = audioRef.current;
      setProgress((currentTime / duration) * 100);
    }
  };

  // Add event listener for audio ended
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => {
      setIsPlaying(false);
      audio.currentTime = 0;
    };

    audio.addEventListener("ended", handleEnded);
    return () => {
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  return (
    <Card
      className="group relative flex max-h-[22rem] cursor-pointer flex-col justify-between overflow-hidden rounded-xl p-3 opacity-100 transition-all duration-300 md:max-h-none md:p-4 lg:p-5"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
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
      />
      <div className="relative flex aspect-square max-h-96 w-full items-center justify-center">
        <Image
          ref={imageRef as any}
          className="absolute left-1/2 top-1/2 z-20 h-auto max-h-[200px] w-auto max-w-[200px] -translate-x-1/2 -translate-y-1/2 transform rounded-md object-contain shadow-md transition duration-200 md:max-h-[250px] md:max-w-[250px] md:shadow-lg"
          src={data.image}
          alt={data.name}
          width={250}
          height={250}
          unoptimized={true}
          crossOrigin="anonymous"
        />
      </div>
      <div className="z-20">
        <div className="z-20 size-fit text-base font-bold md:text-xl lg:text-3xl">
          {"explicit" in data && data.explicit && (
            <AlertCircle className="z-20 mr-1 inline-block h-4 w-4" />
          )}

          <span className="z-20 size-fit text-base font-bold text-white md:text-xl lg:text-2xl">
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
        />
      )}
      <div className="z-20 my-2 grid grid-cols-5 text-xl text-white md:my-3 md:text-2xl lg:my-4 lg:text-3xl">
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
              >
                <X />
              </motion.div>
            ) : isPlaying ? (
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
              >
                <Play />
              </motion.div>
            )}
          </AnimatePresence>
          <div className="invisible">
            <Play />
          </div>
        </motion.div>
      </div>

      <Progress value={progress} className="z-20 h-2" />
    </Card>
  );
}
