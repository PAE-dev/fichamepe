"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Bell, Heart, Menu, MessageCircle, Plus, X } from "lucide-react";
import { useOverlayState } from "@heroui/react";
import { Button } from "@heroui/react/button";
import { Drawer } from "@heroui/react/drawer";
import { Dropdown } from "@heroui/react/dropdown";
import { ChatDock } from "@/components/conversaciones/ChatDock";
import { ConversationsPopover } from "@/components/conversaciones/ConversationsPopover";
import { useAuthModals } from "@/components/auth/auth-modals-context";
import { PublishSkillModal } from "@/components/services/PublishSkillModal";
import { useAuthStore } from "@/store/auth.store";
import { useConversationsStore } from "@/stores/conversationsStore";
import { NavbarCompactSearch } from "@/components/layout/NavbarCompactSearch";
import { SITE_LOGO_URL } from "@/lib/constants";
import type { AuthUser } from "@/types/auth";

const ACCOUNT_MENU_LINKS = [
  { href: "/dashboard?seccion=configuracion", label: "Configuración" },
  { href: "/dashboard?seccion=publicaciones", label: "Mis publicaciones" },
  { href: "/dashboard?seccion=solicitudes-aprobadas", label: "Solicitudes aprobadas" },
] as const;

function firstNameFromUser(user: AuthUser): string {
  const full = user.fullName?.trim();
  if (full) {
    const first = full.split(/\s+/)[0];
    return first ?? full;
  }
  const local = user.email.split("@")[0];
  return local || "Usuario";
}

function initialsFromUser(user: AuthUser): string {
  const full = user.fullName?.trim();
  if (full) {
    const parts = full.split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
      return `${parts[0]!.slice(0, 1)}${parts[1]!.slice(0, 1)}`.toUpperCase();
    }
    return full.slice(0, 2).toUpperCase();
  }
  return user.email.slice(0, 2).toUpperCase();
}

function accountPillClassName(fullWidth?: boolean) {
  return `group flex items-center gap-2.5 rounded-full border border-border bg-white py-1.5 text-left transition hover:border-primary/45 hover:bg-primary/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ${
    fullWidth ? "w-full px-2" : "max-w-[min(100%,220px)] shrink-0 pl-1.5 pr-3"
  }`;
}

function UserAccountPillContent({ user }: { user: AuthUser }) {
  const name = firstNameFromUser(user);
  const initials = initialsFromUser(user);
  const avatar = user.avatarUrl?.trim() || null;
  return (
    <span className="flex min-w-0 flex-1 items-center gap-2.5">
      <span className="relative flex size-9 shrink-0 overflow-hidden rounded-full bg-gradient-to-br from-primary to-primary-light shadow-sm">
        {avatar ? (
          <Image src={avatar} alt="" fill className="object-cover" sizes="36px" />
        ) : (
          <span
            className="flex size-full items-center justify-center text-xs font-bold text-white"
            aria-hidden
          >
            {initials}
          </span>
        )}
      </span>
      <span className="min-w-0 flex-1 text-left">
        <span className="block truncate text-sm font-semibold leading-tight text-foreground group-hover:text-primary">
          Hola, {name}
        </span>
        <span className="block truncate text-xs text-muted">Mi cuenta</span>
      </span>
    </span>
  );
}

function UserAccountDropdown({ user }: { user: AuthUser }) {
  const router = useRouter();
  const logout = useAuthStore((s) => s.logout);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <Dropdown>
      <Dropdown.Trigger
        className={`${accountPillClassName()} !h-auto !min-h-0 !rounded-full !border-border !bg-white !py-1.5 !pl-1.5 !pr-3 !font-normal !shadow-none hover:!bg-primary/[0.06]`}
        aria-label="Menú de cuenta"
      >
        <UserAccountPillContent user={user} />
      </Dropdown.Trigger>
      <Dropdown.Popover placement="bottom end" className="min-w-[220px]">
        <Dropdown.Menu aria-label="Cuenta">
          <Dropdown.Item key="/cuenta/perfil" href="/cuenta/perfil" className="cursor-pointer">
            Editar perfil
          </Dropdown.Item>
          {ACCOUNT_MENU_LINKS.map((item) => (
            <Dropdown.Item key={item.href} href={item.href} className="cursor-pointer">
              {item.label}
            </Dropdown.Item>
          ))}
          <Dropdown.Item variant="danger" className="cursor-pointer" onAction={handleLogout}>
            Cerrar sesión
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
  );
}

function UserAccountMobileBlock({
  user,
  onNavigate,
}: {
  user: AuthUser;
  onNavigate?: () => void;
}) {
  const router = useRouter();
  const logout = useAuthStore((s) => s.logout);
  const hubHref = "/cuenta";
  const linkClass =
    "rounded-lg px-3 py-2.5 text-sm font-medium text-foreground transition hover:bg-primary/5";

  const handleLogout = () => {
    onNavigate?.();
    logout();
    router.push("/");
  };

  return (
    <div className="flex flex-col gap-1 border-t border-border pt-4">
      <Link
        href={hubHref}
        onClick={onNavigate}
        className={`${accountPillClassName(true)} no-underline`}
      >
        <UserAccountPillContent user={user} />
      </Link>
      <div className="mt-1 flex flex-col gap-0.5">
        <Link href="/cuenta/perfil" onClick={onNavigate} className={linkClass}>
          Editar perfil
        </Link>
        {ACCOUNT_MENU_LINKS.map((item) => (
          <Link key={item.href} href={item.href} onClick={onNavigate} className={linkClass}>
            {item.label}
          </Link>
        ))}
        <button type="button" onClick={handleLogout} className={`${linkClass} text-left text-accent-red`}>
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}

function BrandLink() {
  return (
    <Link
      href="/"
      className="group flex shrink-0 items-center no-underline outline-none transition-opacity hover:opacity-95 focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2"
    >
      <Image
        src={SITE_LOGO_URL}
        alt="fichame.pe"
        width={360}
        height={78}
        className="h-12 w-auto shrink-0 object-contain object-left transition-transform duration-200 group-hover:scale-[1.01] sm:h-12 md:h-14"
        priority
        sizes="(max-width: 640px) 280px, (max-width: 1024px) 360px, 400px"
      />
    </Link>
  );
}

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const linkClass =
    "whitespace-nowrap text-sm text-muted transition-colors duration-150 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 rounded-md px-1 py-0.5";

  return (
    <>
      <Link href="/explorar" className={linkClass} onClick={onNavigate}>
        Explorar
      </Link>
      <Link href="/como-funciona" className={linkClass} onClick={onNavigate}>
        Cómo funciona
      </Link>
      <Link href="/solicitar" className={linkClass} onClick={onNavigate}>
        Solicitar
      </Link>
    </>
  );
}

function AuthButtons({
  fullWidth,
  onPressLogin,
  onPressRegister,
}: {
  fullWidth?: boolean;
  onPressLogin: () => void;
  onPressRegister: () => void;
}) {
  const w = fullWidth ? "w-full" : "";

  return (
    <div
      className={`flex flex-col gap-2 sm:flex-row sm:items-center ${fullWidth ? "w-full" : ""}`}
    >
      <Button
        variant="outline"
        className={`rounded-full border-primary bg-transparent px-5 font-semibold text-primary hover:bg-primary/5 ${w}`}
        onPress={onPressLogin}
      >
        Inicio de sesión
      </Button>
      <Button
        variant="primary"
        className={`rounded-full bg-gradient-to-r from-primary to-primary-light px-5 font-semibold text-white hover:opacity-95 ${w}`}
        onPress={onPressRegister}
      >
        Empieza gratis
      </Button>
    </div>
  );
}

export function Navbar() {
  const mobileNav = useOverlayState();
  const publishSkillState = useOverlayState();
  const { openLogin, openRegister } = useAuthModals();
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const unreadTotal = useConversationsStore((state) => state.unreadTotal());
  const [notifications] = useState(3);
  const [isConversationsOpen, setIsConversationsOpen] = useState(false);
  const conversationsMenuRef = useRef<HTMLDivElement | null>(null);
  const accountUser = isAuthenticated && user ? user : null;

  useEffect(() => {
    if (!isConversationsOpen) return;
    const onClickOutside = (event: MouseEvent) => {
      if (!conversationsMenuRef.current) return;
      if (!conversationsMenuRef.current.contains(event.target as Node)) {
        setIsConversationsOpen(false);
      }
    };
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsConversationsOpen(false);
      }
    };
    window.addEventListener("mousedown", onClickOutside);
    window.addEventListener("keydown", onEscape);
    return () => {
      window.removeEventListener("mousedown", onClickOutside);
      window.removeEventListener("keydown", onEscape);
    };
  }, [isConversationsOpen]);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border bg-white/95 backdrop-blur">
        <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-3 px-4 py-2">
          <BrandLink />

          <div className="hidden min-w-[320px] max-w-[540px] flex-1 xl:block">
            <NavbarCompactSearch className="w-full" />
          </div>

          <nav className="hidden items-center gap-4 lg:flex">
            <NavLinks />
          </nav>

          <div className="hidden items-center gap-2 lg:flex">
            {accountUser ? (
              <>
                <Button
                  variant="primary"
                  className="hidden rounded-full bg-[#7B61FF] px-4 font-semibold text-white hover:opacity-95 xl:inline-flex"
                  onPress={() => publishSkillState.open()}
                >
                  <Plus className="size-4" aria-hidden />
                  Publicar habilidad
                </Button>

                <div className="relative" ref={conversationsMenuRef}>
                  <button
                    type="button"
                    className="relative inline-flex size-10 items-center justify-center rounded-full border border-[#7B61FF]/30 bg-[#7B61FF]/10 text-[#7B61FF] transition hover:border-[#7B61FF]/50 hover:bg-[#7B61FF]/15"
                    aria-label="Conversaciones"
                    onClick={() => setIsConversationsOpen((prev) => !prev)}
                  >
                    <MessageCircle className="size-4" aria-hidden />
                    {unreadTotal > 0 ? (
                      <span className="absolute -right-0.5 -top-0.5 inline-flex min-w-4 items-center justify-center rounded-full bg-[#7B61FF] px-1 py-0.5 text-[10px] font-bold text-white">
                        {unreadTotal}
                      </span>
                    ) : null}
                  </button>
                  {isConversationsOpen ? (
                    <div className="absolute right-0 top-[calc(100%+8px)] z-[65]">
                      <ConversationsPopover onOpenChange={setIsConversationsOpen} />
                    </div>
                  ) : null}
                </div>

                <Link
                  href="/notificaciones"
                  className="relative inline-flex size-10 items-center justify-center rounded-full border border-border text-muted transition hover:border-primary/40 hover:text-primary"
                  aria-label="Notificaciones"
                >
                  <Bell className="size-4" aria-hidden />
                  <span className="absolute -right-0.5 -top-0.5 inline-flex size-4 items-center justify-center rounded-full bg-accent-red text-[10px] font-bold text-white">
                    {notifications}
                  </span>
                </Link>
                <Link
                  href="/favoritos"
                  className="inline-flex size-10 items-center justify-center rounded-full border border-border text-muted transition hover:border-primary/40 hover:text-primary"
                  aria-label="Favoritos"
                >
                  <Heart className="size-4" aria-hidden />
                </Link>
                <UserAccountDropdown user={accountUser} />
              </>
            ) : (
              <AuthButtons onPressLogin={openLogin} onPressRegister={openRegister} />
            )}
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            {accountUser ? (
              <>
                <button
                  type="button"
                  onClick={() => publishSkillState.open()}
                  className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#7B61FF] text-white shadow-sm transition hover:opacity-95"
                  aria-label="Publicar habilidad"
                >
                  <Plus className="size-5" aria-hidden />
                </button>
                <Link
                  href="/conversaciones"
                  className="relative inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#7B61FF]/30 bg-[#7B61FF]/10 text-[#7B61FF] transition hover:border-[#7B61FF]/50"
                  aria-label="Conversaciones"
                >
                  <MessageCircle className="size-5" aria-hidden />
                  {unreadTotal > 0 ? (
                    <span className="absolute -right-0.5 -top-0.5 inline-flex min-w-4 items-center justify-center rounded-full bg-[#7B61FF] px-1 py-0.5 text-[10px] font-bold text-white">
                      {unreadTotal}
                    </span>
                  ) : null}
                </Link>
              </>
            ) : null}
            <Drawer state={mobileNav}>
              <Drawer.Trigger
                aria-label="Abrir menú"
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-white text-foreground outline-none transition-colors hover:bg-primary/5 focus-visible:ring-2 focus-visible:ring-primary/40"
              >
                <Menu className="size-5 shrink-0" strokeWidth={2} aria-hidden />
              </Drawer.Trigger>
              <Drawer.Backdrop isDismissable>
                <Drawer.Content placement="right" className="max-w-xs">
                  <Drawer.Dialog className="border-l border-border bg-white">
                    <Drawer.Header className="flex items-center justify-between border-b border-border px-4 py-3">
                      <BrandLink />
                      <Drawer.CloseTrigger
                        aria-label="Cerrar menú"
                        className="inline-flex size-9 items-center justify-center rounded-full text-muted transition-colors hover:bg-primary/5 hover:text-foreground"
                      >
                        <X className="size-5" strokeWidth={2} aria-hidden />
                      </Drawer.CloseTrigger>
                    </Drawer.Header>
                    <Drawer.Body className="flex flex-col gap-6 p-4">
                      <NavbarCompactSearch className="w-full" />
                      <nav className="flex flex-col gap-4">
                        <NavLinks onNavigate={() => mobileNav.close()} />
                      </nav>
                      {accountUser ? (
                        <div className="space-y-2">
                          <Button
                            variant="primary"
                            className="w-full rounded-full bg-[#7B61FF] font-semibold text-white hover:opacity-95"
                            onPress={() => {
                              mobileNav.close();
                              publishSkillState.open();
                            }}
                          >
                            <Plus className="size-4" aria-hidden />
                            Publicar habilidad
                          </Button>
                          <Link
                            href="/conversaciones"
                            onClick={() => mobileNav.close()}
                            className="inline-flex w-full items-center justify-between rounded-xl border border-border px-3 py-2.5 text-sm font-medium text-foreground transition hover:border-primary/35 hover:bg-primary/5"
                          >
                            Conversaciones
                            {unreadTotal > 0 ? (
                              <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-[#7B61FF] px-1.5 py-0.5 text-[10px] font-bold text-white">
                                {unreadTotal}
                              </span>
                            ) : null}
                          </Link>
                          <UserAccountMobileBlock
                            user={accountUser}
                            onNavigate={() => mobileNav.close()}
                          />
                        </div>
                      ) : (
                        <AuthButtons
                          fullWidth
                          onPressLogin={() => {
                            mobileNav.close();
                            openLogin();
                          }}
                          onPressRegister={() => {
                            mobileNav.close();
                            openRegister();
                          }}
                        />
                      )}
                    </Drawer.Body>
                  </Drawer.Dialog>
                </Drawer.Content>
              </Drawer.Backdrop>
            </Drawer>
          </div>
        </div>
      </header>
      <PublishSkillModal state={publishSkillState} />
      {accountUser ? <ChatDock /> : null}
    </>
  );
}
