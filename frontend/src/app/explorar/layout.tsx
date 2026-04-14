import { Suspense, type ReactNode } from "react";

export default function ExplorarLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <Suspense
      fallback={<div className="min-h-screen flex-1 bg-background" aria-hidden />}
    >
      {children}
    </Suspense>
  );
}
