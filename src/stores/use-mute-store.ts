import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";

export type MuteState = {
  isMuted: boolean;
};

export type MuteActions = {
  toggleMute: () => void;
};

export type MuteStore = MuteState & MuteActions;

export const initMuteStore = (): MuteState => {
  return {
    isMuted: false,
  };
};

export const defaultInitState: MuteState = {
  isMuted: false,
};

export const createMuteStore = (initState: MuteState = defaultInitState) => {
  return create<MuteStore>()(
    devtools(
      persist(
        (set) => ({
          ...initState,
          toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),
        }),
        {
          name: "mute-storage",
        },
      ),
    ),
  );
};
