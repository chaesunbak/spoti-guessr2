import { create } from "zustand";
import { persist } from "zustand/middleware";

interface MuteState {
  isMuted: boolean;
  toggleMute: () => void;
}

export const useMuteStore = create<MuteState>()(
  persist(
    (set) => ({
      isMuted: false,
      toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),
    }),
    {
      name: "mute-storage",
    },
  ),
);
