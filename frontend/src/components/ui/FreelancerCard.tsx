import Image from "next/image";
import Link from "next/link";
import { Circle, MapPin } from "lucide-react";
import type { Profile } from "@/types/profile.types";

function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function avatarSrc(url: string | null): string | null {
  if (!url?.trim()) return null;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  const base = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/$/, "");
  if (!base) return url;
  return url.startsWith("/") ? `${base}${url}` : `${base}/${url}`;
}

export type FreelancerCardProps = {
  profile: Profile;
  /** Ancho mínimo para carruseles horizontales */
  className?: string;
};

const MAX_SKILL_CHIPS = 2;

export function FreelancerCard({ profile, className }: FreelancerCardProps) {
  const src = avatarSrc(profile.avatarUrl);
  const visible = profile.skills.slice(0, MAX_SKILL_CHIPS);
  const rest = profile.skills.length - visible.length;
  const rateLabel =
    profile.hourlyRate != null ? `S/${profile.hourlyRate}/hr` : "—";

  return (
    <article
      className={`flex min-w-0 flex-col rounded-2xl border border-[#E5E7EB] bg-white p-4 transition-shadow hover:shadow-md ${className ?? ""}`}
    >
      <div className="flex gap-3">
        <div className="relative size-12 shrink-0 overflow-hidden rounded-full bg-[#F5F5FF]">
          {src ? (
            <Image
              src={src}
              alt=""
              width={48}
              height={48}
              className="size-12 object-cover"
              sizes="48px"
              unoptimized
            />
          ) : (
            <span className="flex size-12 items-center justify-center text-sm font-bold text-[#6C63FF]">
              {initialsFromName(profile.displayName)}
            </span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[15px] font-bold text-[#1A1A2E]">
            {profile.displayName}
          </p>
          <p className="mt-0.5 flex items-center gap-1 text-xs text-[#6B7280]">
            <MapPin className="size-3 shrink-0" aria-hidden />
            <span className="truncate">
              {profile.district ?? "Sin distrito"}
            </span>
          </p>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {visible.map((skill) => (
          <span
            key={skill.id}
            className="rounded-full bg-[#6C63FF]/12 px-2 py-0.5 text-xs font-medium text-[#6C63FF]"
          >
            {skill.name}
          </span>
        ))}
        {rest > 0 ? (
          <span className="self-center text-xs font-medium text-[#6B7280]">
            +{rest}
          </span>
        ) : null}
      </div>

      <div className="mt-3 flex items-center justify-between gap-2">
        <p className="text-base font-bold text-[#1A1A2E]">{rateLabel}</p>
        {profile.isAvailable ? (
          <span className="inline-flex items-center gap-1 rounded-full border border-[#E5E7EB] bg-white px-2 py-0.5 text-xs font-semibold text-[#1A1A2E]">
            <Circle
              className="size-2 shrink-0 fill-[#C8F135] text-[#C8F135]"
              aria-hidden
            />
            Disponible
          </span>
        ) : null}
      </div>

      <Link
        href={`/perfil/${profile.id}`}
        className="mt-3 flex w-full items-center justify-center rounded-full border border-[#6C63FF] bg-white py-2.5 text-sm font-semibold text-[#6C63FF] transition-colors hover:bg-[#6C63FF]/5"
      >
        Ver perfil
      </Link>
    </article>
  );
}
