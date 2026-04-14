"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/react/button";
import { InputGroup } from "@heroui/react/input-group";
import { Search } from "lucide-react";
import { buildExploreSearchUrl } from "@/lib/search-route";

const SEARCH_PLACEHOLDER =
  "Ej: alguien que me ayude con algo, me arregle algo o me saque de un apuro";

export function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const submit = useCallback(() => {
    router.push(buildExploreSearchUrl(query));
  }, [query, router]);

  return (
    <InputGroup
      className="mx-auto w-full max-w-[560px] rounded-[12px] border border-[#E5E7EB] bg-white shadow-sm transition-shadow focus-within:border-[#6C63FF] focus-within:shadow-md"
      fullWidth
    >
      <InputGroup.Prefix className="pl-3.5 text-[#6B7280]">
        <Search className="size-[18px] shrink-0" aria-hidden strokeWidth={2} />
      </InputGroup.Prefix>
      <InputGroup.Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            submit();
          }
        }}
        placeholder={SEARCH_PLACEHOLDER}
        aria-label="Buscar servicios"
        className="min-h-14 py-3.5 text-base text-[#1A1A2E] placeholder:text-[#6B7280]"
      />
      <InputGroup.Suffix className="pr-2">
        <Button
          type="button"
          size="lg"
          className="rounded-lg bg-[#6C63FF] px-5 font-semibold text-white hover:opacity-95"
          onPress={submit}
        >
          Buscar
        </Button>
      </InputGroup.Suffix>
    </InputGroup>
  );
}
