"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useAuthModals } from "@/components/auth/auth-modals-context";
import { useAuthStore } from "@/store/auth.store";

/**
 * Si la URL trae ?ref=CODIGO y no hay sesión, abre el registro con el código
 * y limpia el query para no reabrir el modal en cada navegación.
 */
export function ReferralLinkOpener() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const { openRegister } = useAuthModals();
  const handledKeyRef = useRef<string | null>(null);

  useEffect(() => {
    const raw = searchParams.get("ref")?.trim();
    if (!raw) return;
    const key = `${pathname}?${searchParams.toString()}`;
    if (handledKeyRef.current === key) return;
    handledKeyRef.current = key;

    const next = new URLSearchParams(searchParams.toString());
    next.delete("ref");
    const qs = next.toString();
    const path = qs ? `${pathname}?${qs}` : pathname;
    router.replace(path);

    if (useAuthStore.getState().isAuthenticated) {
      return;
    }
    openRegister({ referralCode: raw.toUpperCase() });
  }, [searchParams, pathname, router, openRegister]);

  return null;
}
