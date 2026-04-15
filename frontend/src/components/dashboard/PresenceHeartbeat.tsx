"use client";

import { useEffect } from "react";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/auth.store";

export function PresenceHeartbeat() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const accessToken = useAuthStore((s) => s.accessToken);

  useEffect(() => {
    if (!isAuthenticated || !accessToken) return;

    let cancelled = false;

    const ping = async () => {
      try {
        await api.post("/presence/heartbeat", {});
      } catch {
        // silencioso: solo para métricas
      }
    };

    void ping();
    const id = window.setInterval(() => {
      if (cancelled) return;
      void ping();
    }, 45_000);

    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, [isAuthenticated, accessToken]);

  return null;
}

