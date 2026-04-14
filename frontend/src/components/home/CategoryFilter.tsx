"use client";

import { useRouter } from "next/navigation";
import { Chip } from "@heroui/react/chip";

const TAGS = [
  "Diseño web",
  "React",
  "Inglés",
  "Canva",
  "Video",
  "Excel",
] as const;

export function CategoryFilter() {
  const router = useRouter();

  return (
    <div className="mt-4 flex flex-wrap justify-center gap-2">
      {TAGS.map((term) => (
        <Chip
          key={term}
          variant="soft"
          className="cursor-pointer border border-[#6C63FF]/40 bg-white text-sm font-medium text-[#6C63FF] transition-colors hover:border-[#6C63FF] hover:bg-[#F5F5FF]"
          onClick={() =>
            router.push(`/explorar?search=${encodeURIComponent(term)}`)
          }
        >
          {term}
        </Chip>
      ))}
    </div>
  );
}
