import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";
import type { User } from "@/types/user";

export type AuthState = {
  user: User | null;
};

export type AuthActions = {
  loginUser: (user: User) => void;
  logoutUser: () => void;
};

export type AuthStore = AuthState & AuthActions;

export const initAuthStore = (): AuthState => {
  return {
    user: null,
  };
};

export const defaultInitState: AuthState = {
  user: null,
};

export const createAuthStore = (initState: AuthState = defaultInitState) => {
  return create<AuthStore>()(
    devtools(
      persist(
        (set) => ({
          ...initState,
          loginUser: (user: User) => set({ user }),
          logoutUser: () => set({ user: null }),
        }),
        {
          name: "auth-storage",
        },
      ),
    ),
  );
};
