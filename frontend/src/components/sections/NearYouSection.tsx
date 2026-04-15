"use client";

import { MapPin } from "lucide-react";
import { ServiceCard } from "@/components/cards/ServiceCard";
import { useGeolocation } from "@/hooks/useGeolocation";
import type { ServicePublic } from "@/types/service.types";

export function NearYouSection({ services }: { services: ServicePublic[] }) {
  const { latitude, longitude } = useGeolocation();
  const near = services
    .filter((service) => typeof service.distanceKm === "number")
    .sort((a, b) => (a.distanceKm ?? 999) - (b.distanceKm ?? 999))
    .slice(0, 4);

  return (
    <section className="space-y-3">
      <header className="flex items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-success">
            Cerca de ti
          </p>
          <h2 className="text-2xl font-bold text-foreground">Servicios presenciales en tu zona</h2>
        </div>
        <p className="inline-flex items-center gap-1 text-xs text-muted">
          <MapPin className="size-3.5 text-success" aria-hidden />
          {latitude && longitude ? "Ubicacion detectada" : "Activa tu ubicacion"}
        </p>
      </header>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
        {near.map((service) => (
          <div key={service.id} className="h-full min-h-0">
            <ServiceCard service={service} />
          </div>
        ))}
      </div>
    </section>
  );
}
