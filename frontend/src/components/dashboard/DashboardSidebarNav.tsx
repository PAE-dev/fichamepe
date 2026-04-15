"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, ShieldCheck, Users } from "lucide-react";

const DASHBOARD_LINKS = [
  { href: "/dashboard/resumen", label: "Resumen", icon: BarChart3 },
  { href: "/dashboard/revision", label: "Revisión", icon: ShieldCheck },
  { href: "/dashboard/usuarios", label: "Usuarios", icon: Users },
] as const;

export function DashboardSidebarNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1" aria-label="Administración">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">
        Dashboard
      </p>
      {DASHBOARD_LINKS.map((item) => {
        const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
              active ? "bg-primary/10 text-primary" : "text-foreground hover:bg-primary/[0.06]"
            }`}
          >
            <Icon className="size-4 shrink-0" aria-hidden />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

