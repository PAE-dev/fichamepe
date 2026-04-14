import type { ReactNode } from "react";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { CuentaShell } from "@/components/cuenta/CuentaShell";

export default function CuentaLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <div className="flex min-h-full flex-col">
      <Navbar />
      <CuentaShell>{children}</CuentaShell>
      <Footer />
    </div>
  );
}
