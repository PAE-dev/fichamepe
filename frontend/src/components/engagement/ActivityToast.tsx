"use client";

import { useEffect, useState } from "react";
import { Bell } from "lucide-react";

const EVENTS = [
  "Maria acaba de contratar un editor de TikTok",
  "Luis reservo un fotografo en Miraflores",
  "Carla compro un pack CV + LinkedIn",
] as const;

export function ActivityToast() {
  const [visible, setVisible] = useState(false);
  const [eventIndex, setEventIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setVisible(true);
      setEventIndex((prev) => (prev + 1) % EVENTS.length);
      window.setTimeout(() => setVisible(false), 2200);
    }, 7500);
    return () => window.clearInterval(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed right-4 top-24 z-50 rounded-xl border border-border bg-white p-3 shadow-lg">
      <p className="flex items-center gap-2 text-xs font-medium text-foreground">
        <Bell className="size-3.5 text-primary" aria-hidden />
        {EVENTS[eventIndex]}
      </p>
    </div>
  );
}
