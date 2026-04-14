"use client";

import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { RouterProvider } from "react-aria-components";
import { ServiceWorkerRegister } from "@/components/ServiceWorkerRegister";
import { AuthModalsProvider } from "@/components/auth/auth-modals-provider";
import { SessionBootstrap } from "@/components/SessionBootstrap";

/**
 * HeroUI v3 no exporta `HeroUIProvider` desde `@heroui/react` (solo CSS + componentes).
 * Este `HeroUIProvider` local envuelve la app; `RouterProvider` aporta `navigate` para enlaces cliente (React Aria).
 */
export function HeroUIProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  return <RouterProvider navigate={router.push}>{children}</RouterProvider>;
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <HeroUIProvider>
      <SessionBootstrap />
      <ServiceWorkerRegister />
      <AuthModalsProvider>{children}</AuthModalsProvider>
    </HeroUIProvider>
  );
}
