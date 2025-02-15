"use client";

import { Play, Pause, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface AudioControlProps {
  previewUrl: string | null;
  isPlaying: boolean;
  paused: boolean;
  setPaused: (paused: boolean) => void;
  togglePlay: () => void;
}

export function AudioControlButton({
  previewUrl,
  isPlaying,
  paused,
  setPaused,
  togglePlay,
}: AudioControlProps) {
  return (
    <div
      className="z-20 my-2 flex items-center justify-center text-xl text-white md:my-3 md:text-2xl lg:my-4 lg:text-3xl"
      role="region"
      aria-label="Audio controls"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.2 }}
        className="flex aspect-square items-center justify-center rounded-full p-2 transition-colors duration-200 hover:bg-white/20 md:p-3 lg:p-4"
        onClick={(e) => {
          e.stopPropagation();
          togglePlay();
        }}
        role="button"
        tabIndex={0}
        aria-label={
          !previewUrl
            ? "No audio preview available"
            : isPlaying
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
          {!previewUrl ? (
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
              className="flex items-center justify-center"
              aria-hidden="true"
            >
              <X className="h-6 w-6 fill-white" />
            </motion.div>
          ) : isPlaying ? (
            <motion.div
              key="pause"
              onClick={() => setPaused(true)}
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
              className="flex items-center justify-center"
              aria-hidden="true"
            >
              <Pause className="h-6 w-6 fill-white" />
            </motion.div>
          ) : (
            <motion.div
              key="play"
              onClick={() => setPaused(false)}
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
              className="flex items-center justify-center"
              aria-hidden="true"
            >
              <Play className="h-6 w-6 fill-white" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
