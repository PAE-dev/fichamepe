import type { ReactNode } from "react";
import { CuentaSidebarNav } from "@/components/cuenta/CuentaSidebarNav";

export function CuentaShell({ children }: { children: ReactNode }) {
  return (
    <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Mi cuenta</h1>
        <p className="mt-1 text-sm text-muted">
          Gestiona tu perfil y accesos desde un solo lugar.
        </p>
      </div>
      <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">
        <aside className="shrink-0 lg:w-56 lg:pt-1">
          <div className="lg:sticky lg:top-24">
            <CuentaSidebarNav />
          </div>
        </aside>
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </main>
  );
}
