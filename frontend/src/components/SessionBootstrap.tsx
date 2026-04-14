"use client";

import { useEffect, useRef } from "react";
import { bootstrapSessionFromCookies } from "@/lib/api";
import { useAuthStore } from "@/store/auth.store";

export function SessionBootstrap() {
  const ran = useRef(false);
  useEffect(() => {
    if (ran.current) return;
    ran.current = true;
    if (useAuthStore.getState().accessToken) return;
    void bootstrapSessionFromCookies().then((ok) => {
      if (!ok) {
        useAuthStore.getState().logout();
        return;
      }
      void import("@/stores/favoritesStore").then(({ useFavoritesStore }) => {
        void useFavoritesStore.getState().syncFromApi();
      });
    });
  }, []);
  return null;
}
