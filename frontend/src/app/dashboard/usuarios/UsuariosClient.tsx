"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@heroui/react/button";
import { Search } from "lucide-react";
import type { AdminUserRole, AdminUsersResponse } from "@/lib/api/admin-users.api";
import { fetchAdminUsers } from "@/lib/api/admin-users.api";

type ViewState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; data: AdminUsersResponse };

function formatAge(createdAtIso: string): string {
  const t = new Date(createdAtIso).getTime();
  if (!Number.isFinite(t)) return "—";
  const days = Math.max(0, Math.floor((Date.now() - t) / (24 * 60 * 60_000)));
  if (days < 1) return "Hoy";
  if (days === 1) return "1 día";
  if (days < 30) return `${days} días`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} mes${months === 1 ? "" : "es"}`;
  const years = Math.floor(months / 12);
  return `${years} año${years === 1 ? "" : "s"}`;
}

function isOnlineNow(lastSeenAtIso: string | null | undefined): boolean {
  if (!lastSeenAtIso) return false;
  const t = new Date(lastSeenAtIso).getTime();
  if (!Number.isFinite(t)) return false;
  return t >= Date.now() - 5 * 60_000;
}

export function UsuariosClient() {
  const [state, setState] = useState<ViewState>({ status: "loading" });
  const [search, setSearch] = useState("");
  const [role, setRole] = useState<AdminUserRole | "all">("all");
  const [page, setPage] = useState(0);
  const limit = 25;

  const load = async (opts?: { resetPage?: boolean }) => {
    setState({ status: "loading" });
    const offset = (opts?.resetPage ? 0 : page) * limit;
    try {
      const data = await fetchAdminUsers({
        search: search.trim() ? search.trim() : undefined,
        role: role === "all" ? undefined : role,
        offset,
        limit,
      });
      setState({ status: "ready", data });
      if (opts?.resetPage) setPage(0);
    } catch {
      setState({ status: "error", message: "No pudimos cargar la lista de usuarios." });
    }
  };

  useEffect(() => {
    void load({ resetPage: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role]);

  const totalPages = useMemo(() => {
    if (state.status !== "ready") return 1;
    return Math.max(1, Math.ceil((state.data.total ?? 0) / limit));
  }, [state]);

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-primary">Usuarios</p>
        <h2 className="text-xl font-extrabold tracking-tight text-foreground sm:text-2xl">
          Gestión de usuarios
        </h2>
        <p className="text-sm text-muted">
          Revisa datos básicos, antigüedad y trazabilidad (último login y presencia).
        </p>
      </header>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-2 rounded-2xl border border-border bg-white px-3 py-2 shadow-sm">
          <Search className="size-4 text-muted" aria-hidden />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por correo o nombre…"
            className="w-full bg-transparent text-sm text-foreground outline-none"
          />
          <Button
            variant="primary"
            className="rounded-full bg-primary px-4 text-white"
            onPress={() => void load({ resetPage: true })}
          >
            Buscar
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-muted">Rol</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as AdminUserRole | "all")}
            className="h-10 rounded-xl border border-border bg-white px-3 text-sm font-medium text-foreground"
          >
            <option value="all">Todos</option>
            <option value="admin">Admin</option>
            <option value="freelancer">Freelancer</option>
            <option value="client">Cliente</option>
          </select>
        </div>
      </div>

      {state.status === "error" ? (
        <div className="rounded-2xl border border-border bg-surface-elevated px-6 py-10 text-center">
          <p className="text-sm font-medium text-foreground">{state.message}</p>
          <Button
            variant="primary"
            className="mt-5 rounded-full bg-primary px-6 text-white"
            onPress={() => void load()}
          >
            Reintentar
          </Button>
        </div>
      ) : null}

      {state.status === "loading" ? (
        <div className="space-y-2">
          {Array.from({ length: 8 }).map((_, idx) => (
            <div key={idx} className="h-16 animate-pulse rounded-2xl border border-border bg-surface-elevated" />
          ))}
        </div>
      ) : null}

      {state.status === "ready" ? (
        <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
          <div className="overflow-x-auto">
            <div className="min-w-[860px]">
              <div className="grid grid-cols-[1.6fr_0.7fr_1.2fr_0.9fr] gap-3 border-b border-border bg-surface-elevated/40 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted">
                <div className="min-w-0">Usuario</div>
                <div className="min-w-0">Antigüedad</div>
                <div className="min-w-0">Origen (último login)</div>
                <div className="min-w-0">Estado</div>
              </div>

              <div className="divide-y divide-border">
                {state.data.items.map((u) => {
                  const displayName = u.profile?.displayName ?? u.fullName ?? "Sin nombre";
                  const online = isOnlineNow(u.presence?.lastSeenAt);
                  return (
                    <div
                      key={u.id}
                      className="grid grid-cols-[1.6fr_0.7fr_1.2fr_0.9fr] gap-3 px-4 py-3"
                    >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="relative size-10 shrink-0 overflow-hidden rounded-full border border-border bg-primary/10">
                      {u.profile?.avatarUrl ? (
                        <Image
                          src={u.profile.avatarUrl}
                          alt=""
                          width={40}
                          height={40}
                          className="size-full object-cover"
                        />
                      ) : (
                        <div className="size-full bg-gradient-to-br from-primary/25 to-primary/10" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-foreground">{displayName}</p>
                      <p className="truncate text-xs text-muted">{u.email}</p>
                      <p className="mt-0.5 truncate text-[11px] font-medium text-muted">
                        Rol: {u.role}
                      </p>
                    </div>
                  </div>

                  <div className="flex min-w-0 flex-col justify-center">
                    <p className="text-sm font-semibold text-foreground">{formatAge(u.createdAt)}</p>
                    <p className="text-xs text-muted whitespace-nowrap">
                      {new Date(u.createdAt).toLocaleDateString("es-PE")}
                    </p>
                  </div>

                  <div className="flex min-w-0 flex-col justify-center">
                    <p className="truncate text-sm font-semibold text-foreground">
                      {u.lastLogin?.ip ?? "—"}
                    </p>
                    <p className="truncate text-xs text-muted">
                      {u.lastLogin?.userAgent ?? "—"}
                    </p>
                  </div>

                  <div className="flex min-w-0 flex-col justify-center">
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-block size-2 rounded-full ${
                          online ? "bg-success" : "bg-muted"
                        }`}
                        aria-hidden
                      />
                      <p className="text-sm font-semibold text-foreground">
                        {online ? "Online" : "Offline"}
                      </p>
                    </div>
                    <p className="text-xs text-muted whitespace-nowrap">
                      {u.presence?.lastSeenAt
                        ? `Visto: ${new Date(u.presence.lastSeenAt).toLocaleString("es-PE")}`
                        : "Sin presencia"}
                    </p>
                  </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border bg-surface-elevated/40 px-4 py-3">
            <p className="text-xs font-semibold text-muted">
              {state.data.total} usuario{state.data.total === 1 ? "" : "s"}
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                className="rounded-full"
                isDisabled={page <= 0}
                onPress={() => {
                  const next = Math.max(0, page - 1);
                  setPage(next);
                  void load();
                }}
              >
                Anterior
              </Button>
              <p className="text-xs font-semibold text-muted">
                {page + 1} / {totalPages}
              </p>
              <Button
                variant="outline"
                className="rounded-full"
                isDisabled={page + 1 >= totalPages}
                onPress={() => {
                  const next = Math.min(totalPages - 1, page + 1);
                  setPage(next);
                  void load();
                }}
              >
                Siguiente
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

