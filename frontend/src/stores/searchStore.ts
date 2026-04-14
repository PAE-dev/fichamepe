"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

type SearchState = {
  recentSearches: string[];
  addRecentSearch: (query: string) => void;
};

export const useSearchStore = create<SearchState>()(
  persist(
    (set) => ({
      recentSearches: [],
      addRecentSearch: (query) =>
        set((state) => {
          const cleaned = query.trim();
          if (!cleaned) return state;
          const unique = [cleaned, ...state.recentSearches.filter((q) => q !== cleaned)];
          return { recentSearches: unique.slice(0, 8) };
        }),
    }),
    { name: "fichame-searches" },
  ),
);
