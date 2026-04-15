import { Suspense } from "react";
import { CuentaPublicacionesClient } from "./CuentaPublicacionesClient";

export default function CuentaPublicacionesPage() {
  return (
    <Suspense
      fallback={
        <div className="h-48 w-full animate-pulse rounded-2xl border border-border bg-surface-elevated" />
      }
    >
      <CuentaPublicacionesClient />
    </Suspense>
  );
}

