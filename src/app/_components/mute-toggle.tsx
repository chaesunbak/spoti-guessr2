"use client";

import { Button } from "@/components/ui/button";
import { Volume2, VolumeX } from "lucide-react";
import { useMuteStore } from "@/stores/use-mute-store";
import { motion, AnimatePresence } from "framer-motion";

export function MuteToggle() {
  const { isMuted, toggleMute } = useMuteStore();

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleMute}
      title={`${isMuted ? "Click to unmute" : "Click to mute"}`}
      aria-label={`${isMuted ? "Unmute audio" : "Mute audio"}`}
      aria-pressed={isMuted}
      className="relative overflow-hidden"
    >
      <AnimatePresence mode="wait" initial={false}>
        {isMuted ? (
          <motion.div
            key="muted"
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
            <VolumeX className="h-5 w-5" />
          </motion.div>
        ) : (
          <motion.div
            key="unmuted"
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
            <Volume2 className="h-5 w-5" />
          </motion.div>
        )}
      </AnimatePresence>
      <div className="invisible" aria-hidden="true">
        <Volume2 className="h-5 w-5" />
      </div>
      <span className="sr-only">
        {isMuted ? "Audio is muted" : "Audio is playing"}
      </span>
    </Button>
  );
}
