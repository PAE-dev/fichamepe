import type { ReactNode } from "react";
import { DashboardSidebarNav } from "@/components/dashboard/DashboardSidebarNav";
import { PresenceHeartbeat } from "@/components/dashboard/PresenceHeartbeat";

export function DashboardShell({ children }: { children: ReactNode }) {
  return (
    <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:py-10">
      <PresenceHeartbeat />
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Administración
        </h1>
        <p className="mt-1 text-sm text-muted">Métricas y gestión de tu proyecto.</p>
      </div>
      <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">
        <aside className="shrink-0 lg:w-64 lg:pt-1">
          <div className="lg:sticky lg:top-24">
            <DashboardSidebarNav />
          </div>
        </aside>
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </main>
  );
}

