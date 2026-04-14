"use client";

import { create } from "zustand";
import type { AuthUser } from "@/types/auth";

type AuthState = {
  user: AuthUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (accessToken: string, user: AuthUser) => void;
  setAccessToken: (accessToken: string) => void;
  logout: () => void;
  setUser: (user: AuthUser) => void;
  setLoading: (isLoading: boolean) => void;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isLoading: false,
  login: (accessToken, user) =>
    set({
      accessToken,
      user: { ...user, avatarUrl: user.avatarUrl ?? null },
      isAuthenticated: true,
    }),
  setAccessToken: (accessToken) =>
    set({ accessToken, isAuthenticated: !!accessToken }),
  logout: () => {
    const hadSession = get().isAuthenticated || !!get().accessToken;
    set({
      user: null,
      accessToken: null,
      isAuthenticated: false,
    });
    if (hadSession) {
      void import("@/stores/favoritesStore").then(({ useFavoritesStore }) => {
        useFavoritesStore.getState().reset();
      });
    }
    void import("@/lib/api").then(({ api }) =>
      api.post("/auth/logout", {}, { skipAuthRefresh: true }).catch(() => {}),
    );
  },
  setUser: (user) => set({ user: { ...user, avatarUrl: user.avatarUrl ?? null } }),
  setLoading: (isLoading) => set({ isLoading }),
}));
