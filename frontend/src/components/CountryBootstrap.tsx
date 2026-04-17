"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useCountryStore } from "@/stores/countryStore";

/**
 * Hidrata el país desde la cookie si el usuario no eligió ya un modo manual
 * en el store persistido. No infiere país por IP (el feed por defecto es mundial).
 */
export function CountryBootstrap() {
  const router = useRouter();
  const ran = useRef(false);
  const hydrateFromCookie = useCountryStore((s) => s.hydrateFromCookie);

  useEffect(() => {
    if (ran.current) {
      return;
    }
    ran.current = true;
    const initialCountry = useCountryStore.getState().countryCode;

    hydrateFromCookie();
    const afterCookie = useCountryStore.getState();
    if (afterCookie.countryCode && !initialCountry) {
      router.refresh();
    }
  }, [hydrateFromCookie, router]);

  return null;
}
