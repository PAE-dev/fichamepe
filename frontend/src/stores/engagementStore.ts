"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

type EngagementState = {
  points: number;
  profileProgress: number;
  wheelPlayed: boolean;
  promoCode: string | null;
  addPoints: (value: number) => void;
  setProfileProgress: (value: number) => void;
  unlockPromo: (code: string) => void;
  setWheelPlayed: () => void;
};

export const useEngagementStore = create<EngagementState>()(
  persist(
    (set) => ({
      points: 0,
      profileProgress: 45,
      wheelPlayed: false,
      promoCode: null,
      addPoints: (value) => set((state) => ({ points: state.points + value })),
      setProfileProgress: (value) => set({ profileProgress: Math.max(0, Math.min(100, value)) }),
      unlockPromo: (code) => set({ promoCode: code }),
      setWheelPlayed: () => set({ wheelPlayed: true }),
    }),
    { name: "fichame-engagement" },
  ),
);
