"use client";

import { useRouter } from "next/navigation";
import { Chip } from "@heroui/react/chip";

const TAGS = [
  "CV y chamba",
  "Editor viral TikTok",
  "Animador de fiesta",
  "Fotógrafo pro",
  "Ayuda con cita",
  "Armar negocio",
] as const;

export function PopularTags({ compact }: { compact?: boolean }) {
  const router = useRouter();

  return (
    <div
      className={`${compact ? "mt-0 justify-start" : "mt-4 justify-center"} flex flex-wrap gap-2`}
    >
      {TAGS.map((tag) => (
        <Chip
          key={tag}
          variant="soft"
          className={`${compact ? "text-xs sm:text-sm" : "text-sm"} cursor-pointer border-0 bg-[#F5F5FF] font-medium text-[#6C63FF] transition-colors duration-150 hover:bg-[#6C63FF] hover:text-white`}
          onClick={() =>
            router.push(`/explorar?search=${encodeURIComponent(tag)}`)
          }
        >
          {tag}
        </Chip>
      ))}
    </div>
  );
}
