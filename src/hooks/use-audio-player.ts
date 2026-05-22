import { useState, useEffect, useRef } from "react";
import { useMuteStore } from "@/providers/mute-store-provider";

interface UseAudioPlayerProps {
  url: string | null;
  isPlaying: boolean;
  onPlayStateChange: (isPlaying: boolean) => void;
}

export function useAudioPlayer({
  url,
  isPlaying,
  onPlayStateChange,
}: UseAudioPlayerProps) {
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { isMuted } = useMuteStore((state) => state);
  // Store callback in ref so effects don't re-run when inline function identity changes each render
  const onPlayStateChangeRef = useRef(onPlayStateChange);
  useEffect(() => {
    onPlayStateChangeRef.current = onPlayStateChange;
  });
  // Track the last loaded URL to avoid resetting audio on every render
  const loadedUrlRef = useRef<string | null>(null);

  useEffect(() => {
    if (audioRef?.current) {
      audioRef.current.muted = isMuted;
    }
  }, [isMuted]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !url) return;

    let playPromise: Promise<void> | null = null;

    if (isPlaying && !paused) {
      if (loadedUrlRef.current !== url) {
        audio.src = url;
        loadedUrlRef.current = url;
      }
      playPromise = audio.play();
      playPromise.catch((error) => {
        if (error.name !== "AbortError") {
          console.error("Audio playback failed:", error);
          onPlayStateChangeRef.current(false);
        }
      });
    } else {
      audio.pause();
      audio.currentTime = 0;
    }

    return () => {
      if (playPromise) {
        playPromise
          .then(() => {
            audio.pause();
            audio.currentTime = 0;
          })
          .catch(() => {});
      } else {
        audio.pause();
        audio.currentTime = 0;
      }
    };
  }, [isPlaying, url, paused]); // onPlayStateChange intentionally excluded — stored in ref above

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => {
      onPlayStateChangeRef.current(false);
      audio.currentTime = 0;
    };

    const handleTimeUpdate = () => {
      const { currentTime, duration } = audio;
      setProgress((currentTime / duration) * 100);
    };

    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, []); // empty deps — callback accessed via ref

  const togglePlay = () => {
    if (!url) return;

    if (paused) {
      setPaused(false);
    }

    onPlayStateChangeRef.current(!isPlaying);
  };

  const onMouseEnter = () => {
    if (!url || paused) return;
    onPlayStateChangeRef.current(true);
  };

  const onMouseLeave = () => {
    if (!url || paused) return;
    onPlayStateChangeRef.current(false);
  };

  return {
    audioRef,
    progress,
    togglePlay,
    paused,
    setPaused,
    onMouseEnter,
    onMouseLeave,
  };
}
