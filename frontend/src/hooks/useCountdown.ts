"use client";

import { useEffect, useMemo, useState } from "react";

export function useCountdown(targetDate: string | null | undefined) {
  const [now, setNow] = useState(0);

  useEffect(() => {
    if (!targetDate) return;
    const timer = window.setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => window.clearInterval(timer);
  }, [targetDate]);

  return useMemo(() => {
    if (!targetDate) {
      return { isExpired: true, hours: 0, minutes: 0, seconds: 0 };
    }

    const remaining = Math.max(0, new Date(targetDate).getTime() - now);
    const hours = Math.floor(remaining / 3_600_000);
    const minutes = Math.floor((remaining % 3_600_000) / 60_000);
    const seconds = Math.floor((remaining % 60_000) / 1000);

    return {
      isExpired: remaining <= 0,
      hours,
      minutes,
      seconds,
    };
  }, [targetDate, now]);
}
