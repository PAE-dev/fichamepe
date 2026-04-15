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
  const onLoadMoreRef = useRef(onLoadMore);
  onLoadMoreRef.current = onLoadMore;

  useEffect(() => {
    if (!enabled || !ref.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          onLoadMoreRef.current();
        }
      },
      { rootMargin: "0px 0px 300px 0px" },
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [enabled]);

  return ref;
}
