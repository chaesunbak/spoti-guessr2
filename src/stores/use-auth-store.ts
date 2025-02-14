import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/types/user";

interface AuthState {
  user: User | null;
  loginUser: (user: User) => void;
  logoutUser: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      loginUser: (user: User) => set({ user }),
      logoutUser: () => set({ user: null }),
    }),
    {
      name: "auth-storage",
    },
  ),
);
