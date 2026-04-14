"use client";

import { useEffect, useState } from "react";

const MESSAGES = [
  "Si existe, esta aca. Y si no existe, alguien lo hace por ti.",
  "Aca hay talento.",
  "Lima, Peru: gente real resolviendo cosas reales.",
] as const;

export function InfoTicker() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % MESSAGES.length);
    }, 3500);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="border-y border-[#E5E7EB] bg-[#F5F5FF]">
      <div className="mx-auto flex h-11 max-w-7xl items-center px-4 sm:h-12 sm:px-6">
        <p
          className="truncate text-sm font-semibold text-[#1A1A2E] sm:text-[15px]"
          aria-live="polite"
        >
          {MESSAGES[index]}
        </p>
      </div>
    </section>
  );
}
