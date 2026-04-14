"use client";

import Image from "next/image";
import Link from "next/link";
import { BadgeCheck, Eye, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/Badge";
import { CountdownTimer } from "@/components/ui/CountdownTimer";
import { FavoriteButton } from "@/components/ui/FavoriteButton";
import { OnlineIndicator } from "@/components/ui/OnlineIndicator";
import { PriceDisplay } from "@/components/ui/PriceDisplay";
import { StarRating } from "@/components/ui/StarRating";
import type { ServicePublic } from "@/types/service.types";

export function ServiceCard({ service }: { service: ServicePublic }) {
  const profile = service.profile;
  const rating = profile?.rating ?? 4.6;
  const reviews = profile?.reviewCount ?? 12;
  const categoryLabel = service.tags[0] ?? "Servicio destacado";

  return (
    <motion.article
      whileHover={{ y: -4, boxShadow: "0 12px 24px rgba(0,0,0,0.10)" }}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-white"
    >
      <Link href={`/servicios/${service.id}`} className="flex min-h-0 flex-1 flex-col no-underline">
        <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden bg-surface-elevated">
          {service.coverImageUrl ? (
            <Image
              src={service.coverImageUrl}
              alt={service.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
          ) : (
            <div className="fp-gradient-bg relative flex h-full w-full flex-col justify-end p-4">
              <div
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-primary/[0.12] via-transparent to-transparent"
                aria-hidden
              />
              <p className="relative text-left text-xs font-semibold uppercase tracking-wide text-primary/80">
                {categoryLabel}
              </p>
            </div>
          )}
          <div className="absolute left-2 top-2 z-10 flex max-w-[calc(100%-3rem)] flex-wrap items-center gap-1">
            {service.badge ? <Badge badge={service.badge} /> : null}
            <CountdownTimer endsAt={service.flashDealEndsAt} />
          </div>
          <div className="absolute right-2 top-2 z-10">
            <FavoriteButton serviceId={service.id} />
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-3 p-4">
          <div className="flex items-start justify-between gap-2">
            <h3 className="line-clamp-2 text-[15px] font-bold leading-snug tracking-tight text-foreground sm:text-base">
              {service.title}
            </h3>
            {profile?.isVerified ? (
              <BadgeCheck className="mt-0.5 size-4 shrink-0 text-success" aria-hidden />
            ) : null}
          </div>

          <div className="flex items-center gap-2.5">
            <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full bg-primary/10 ring-2 ring-white">
              {profile?.avatarUrl ? (
                <Image
                  src={profile.avatarUrl}
                  alt={profile.displayName}
                  width={36}
                  height={36}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="absolute inset-0 bg-gradient-to-br from-primary/25 to-primary/5" aria-hidden />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-foreground">
                {profile?.displayName ?? "Freelancer"}
              </p>
              <OnlineIndicator
                isOnline={profile?.isAvailable ?? false}
                responseTimeHours={profile?.responseTimeHours}
              />
            </div>
          </div>

          <p className="line-clamp-2 text-sm leading-relaxed text-muted">{service.description}</p>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
            <StarRating rating={rating} reviewCount={reviews} />
            <span className="inline-flex items-center gap-1 text-muted">
              <MessageCircle className="size-3.5 shrink-0" aria-hidden />
              +{service.weeklyHires ?? 0} esta semana
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {service.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-medium text-primary"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="mt-auto flex items-end justify-between gap-3 border-t border-border pt-3">
            <PriceDisplay price={service.price} previousPrice={service.previousPrice} />
            <p className="inline-flex shrink-0 items-center gap-1 text-[11px] text-muted">
              <Eye className="size-3.5" aria-hidden />
              {service.viewCount} vistas
            </p>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
