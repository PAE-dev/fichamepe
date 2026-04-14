"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  addFavorite,
  fetchFavoriteIds,
  removeFavorite,
} from "@/lib/api/favorites.api";
import { useAuthStore } from "@/store/auth.store";

type FavoritesState = {
  favorites: string[];
  setFavorites: (ids: string[]) => void;
  reset: () => void;
  syncFromApi: () => Promise<void>;
  toggleFavorite: (id: string) => Promise<void>;
  isFavorite: (id: string) => boolean;
};

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],
      setFavorites: (ids) => set({ favorites: ids }),
      reset: () => set({ favorites: [] }),
      syncFromApi: async () => {
        if (!useAuthStore.getState().isAuthenticated) {
          return;
        }
        try {
          const ids = await fetchFavoriteIds();
          set({ favorites: ids });
        } catch {
          /* sesión o red */
        }
      },
      toggleFavorite: async (id) => {
        const authed = useAuthStore.getState().isAuthenticated;
        if (!authed) {
          set((state) => ({
            favorites: state.favorites.includes(id)
              ? state.favorites.filter((fav) => fav !== id)
              : [...state.favorites, id],
          }));
          return;
        }

        const wasFavorite = get().favorites.includes(id);
        set((state) => ({
          favorites: wasFavorite
            ? state.favorites.filter((fav) => fav !== id)
            : [...state.favorites, id],
        }));

        try {
          if (wasFavorite) {
            await removeFavorite(id);
          } else {
            await addFavorite(id);
          }
        } catch {
          set((state) => ({
            favorites: wasFavorite
              ? [...state.favorites, id]
              : state.favorites.filter((fav) => fav !== id),
          }));
        }
      },
      isFavorite: (id) => get().favorites.includes(id),
    }),
    { name: "fichame-favorites" },
  ),
);
