"use client";

import { useCallback, useMemo, useState } from "react";
import { ServiceCard } from "@/components/cards/ServiceCard";
import { SkeletonCard } from "@/components/cards/SkeletonCard";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import type { ServicePublic } from "@/types/service.types";

export function DiscoveryFeed({
  services,
  loading,
}: {
  services: ServicePublic[];
  loading?: boolean;
}) {
  const [visible, setVisible] = useState(8);
  const canLoadMore = visible < services.length;
  const markerRef = useInfiniteScroll({
    enabled: canLoadMore,
    onLoadMore: useCallback(() => setVisible((prev) => Math.min(prev + 6, services.length)), [
      services.length,
    ]),
  });

  const visibleItems = useMemo(() => services.slice(0, visible), [services, visible]);

  return (
    <section className="space-y-3">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.08em] text-primary-dark">
          Descubre algo nuevo
        </p>
        <h2 className="text-2xl font-bold text-foreground">Servicios que no sabias que querias</h2>
      </header>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {visibleItems.map((service) => (
          <div key={service.id} className="h-full min-h-0">
            <ServiceCard service={service} />
          </div>
        ))}
        {loading
          ? Array.from({ length: 6 }).map((_, idx) => (
              <div key={`skeleton-${idx}`} className="h-full min-h-0">
                <SkeletonCard />
              </div>
            ))
          : null}
      </div>
      <div ref={markerRef} className="h-2" />
    </section>
  );
}
