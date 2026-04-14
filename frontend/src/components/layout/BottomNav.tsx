"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, Heart, Home, MessageCircle, User } from "lucide-react";

const ITEMS = [
  { href: "/", label: "Inicio", icon: Home },
  { href: "/explorar", label: "Explorar", icon: Compass },
  { href: "/conversaciones", label: "Chats", icon: MessageCircle },
  { href: "/favoritos", label: "Favoritos", icon: Heart },
  { href: "/dashboard", label: "Perfil", icon: User },
] as const;

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-white/95 backdrop-blur md:hidden">
      <ul className="grid grid-cols-5">
        {ITEMS.map((item) => {
          const active =
            item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`flex min-h-11 flex-col items-center justify-center gap-0.5 py-2 text-[11px] ${
                  active ? "text-primary" : "text-muted"
                }`}
              >
                <item.icon className="size-4" aria-hidden />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
