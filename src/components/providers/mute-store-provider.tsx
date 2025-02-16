"use client";

import { type ReactNode, createContext, useRef, useContext } from "react";
import { useStore } from "zustand";

import {
  type MuteStore,
  createMuteStore,
  initMuteStore,
} from "@/stores/use-mute-store";

export type MuteStoreApi = ReturnType<typeof createMuteStore>;

export const MuteStoreContext = createContext<MuteStoreApi | undefined>(
  undefined,
);

export interface MuteStoreProviderProps {
  children: ReactNode;
}

export const MuteStoreProvider = ({ children }: MuteStoreProviderProps) => {
  const storeRef = useRef<MuteStoreApi>(null);
  if (!storeRef.current) {
    storeRef.current = createMuteStore(initMuteStore());
  }

  return (
    <MuteStoreContext.Provider value={storeRef.current}>
      {children}
    </MuteStoreContext.Provider>
  );
};

export const useMuteStore = <T,>(selector: (store: MuteStore) => T): T => {
  const muteStoreContext = useContext(MuteStoreContext);

  if (!muteStoreContext) {
    throw new Error(`useMuteStore must be used within MuteStoreProvider`);
  }

  return useStore(muteStoreContext, selector);
};
