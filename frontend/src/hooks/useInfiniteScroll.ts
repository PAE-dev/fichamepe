"use client";

import { useEffect, useRef } from "react";

export function useInfiniteScroll({
  onLoadMore,
  enabled,
}: {
  onLoadMore: () => void;
  enabled: boolean;
}) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!enabled || !ref.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          onLoadMore();
        }
      },
      { rootMargin: "0px 0px 300px 0px" },
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [enabled, onLoadMore]);

  return ref;
}
