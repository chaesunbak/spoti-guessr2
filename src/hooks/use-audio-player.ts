import { useState, useEffect, useRef } from "react";
import { useMuteStore } from "@/stores/use-mute-store";

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
  const { isMuted } = useMuteStore();

  // Mute audio if user is muted
  useEffect(() => {
    if (audioRef?.current) {
      audioRef.current.muted = isMuted;
    }
  }, [isMuted]);

  // When isPlaying state changes, handle audio playback/pause
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !url) return;

    const playAudio = async () => {
      if (isPlaying && !paused) {
        try {
          audio.src = url;
          await audio.play();
        } catch (error) {
          console.error("Audio playback failed:", error);
          onPlayStateChange(false);
        }
      } else {
        audio.pause();
        audio.currentTime = 0;
      }
    };

    playAudio();

    // When the component unmounts or isPlaying changes, cleanup
    return () => {
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    };
  }, [isPlaying, url, paused]);

  // When audio ends, handle audio playback/pause
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => {
      onPlayStateChange(false);
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
  }, [onPlayStateChange]);

  const togglePlay = () => {
    if (!url) return;

    if (paused) {
      setPaused(false);
    }

    onPlayStateChange(!isPlaying);
  };

  const onMouseEnter = () => {
    if (!url || paused) return;
    onPlayStateChange(true);
  };

  const onMouseLeave = () => {
    if (!url || paused) return;
    onPlayStateChange(false);
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
