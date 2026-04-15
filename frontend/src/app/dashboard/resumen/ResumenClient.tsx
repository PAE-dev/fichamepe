"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@heroui/react/button";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { AdminOverviewStats, AdminStatsBucket } from "@/lib/api/admin-stats.api";
import { fetchAdminOverview } from "@/lib/api/admin-stats.api";

type ViewState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; data: AdminOverviewStats };

function MetricCard(props: { label: string; value: string | number; hint?: string }) {
  return (
    <div className="rounded-2xl border border-border bg-white p-4 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted">{props.label}</p>
      <p className="mt-2 text-2xl font-extrabold tracking-tight text-foreground">{props.value}</p>
      {props.hint ? <p className="mt-1 text-xs text-muted">{props.hint}</p> : null}
    </div>
  );
}

function bucketLabel(bucket: AdminStatsBucket): string {
  switch (bucket) {
    case "year":
      return "Año";
    case "month":
      return "Mes";
    default:
      return "Día";
  }
}

export function ResumenClient() {
  const [bucket, setBucket] = useState<AdminStatsBucket>("day");
  const [reloadToken, setReloadToken] = useState(0);
  const [state, setState] = useState<ViewState>({ status: "loading" });
  const usersChartRef = useRef<HTMLDivElement | null>(null);
  const servicesChartRef = useRef<HTMLDivElement | null>(null);
  const [usersChartReady, setUsersChartReady] = useState(false);
  const [servicesChartReady, setServicesChartReady] = useState(false);

  useEffect(() => {
    let alive = true;
    setState({ status: "loading" });
    fetchAdminOverview({ bucket })
      .then((data) => {
        if (!alive) return;
        setState({ status: "ready", data });
      })
      .catch(() => {
        if (!alive) return;
        setState({ status: "error", message: "No pudimos cargar las métricas del dashboard." });
      });
    return () => {
      alive = false;
    };
  }, [bucket, reloadToken]);

  useEffect(() => {
    const node = usersChartRef.current;
    if (!node) return;
    if (typeof ResizeObserver === "undefined") {
      setUsersChartReady(true);
      return;
    }
    const ro = new ResizeObserver((entries) => {
      const cr = entries[0]?.contentRect;
      if (!cr) return;
      if (cr.width > 0 && cr.height > 0) setUsersChartReady(true);
    });
    ro.observe(node);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const node = servicesChartRef.current;
    if (!node) return;
    if (typeof ResizeObserver === "undefined") {
      setServicesChartReady(true);
      return;
    }
    const ro = new ResizeObserver((entries) => {
      const cr = entries[0]?.contentRect;
      if (!cr) return;
      if (cr.width > 0 && cr.height > 0) setServicesChartReady(true);
    });
    ro.observe(node);
    return () => ro.disconnect();
  }, []);

  const chartUsers = useMemo(() => {
    if (state.status !== "ready") return [];
    return (state.data.series.users ?? []).map((p) => ({ name: p.bucket, value: p.count }));
  }, [state]);

  const chartServices = useMemo(() => {
    if (state.status !== "ready") return [];
    return (state.data.series.services ?? []).map((p) => ({ name: p.bucket, value: p.count }));
  }, [state]);

  if (state.status === "error") {
    return (
      <div className="rounded-2xl border border-border bg-surface-elevated px-6 py-10 text-center">
        <p className="text-sm font-medium text-foreground">{state.message}</p>
        <Button
          variant="primary"
          className="mt-5 rounded-full bg-primary px-6 text-white"
          onPress={() => setReloadToken((x) => x + 1)}
        >
          Reintentar
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-primary">Resumen</p>
        <h2 className="text-xl font-extrabold tracking-tight text-foreground sm:text-2xl">
          Métricas generales
        </h2>
        <p className="text-sm text-muted">
          Vista rápida de crecimiento, actividad y publicaciones.
        </p>
      </header>

      <div className="flex flex-wrap items-center gap-2">
        {(["day", "month", "year"] as const).map((b) => (
          <button
            key={b}
            type="button"
            onClick={() => setBucket(b)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              bucket === b ? "bg-primary text-white" : "border border-border bg-white text-foreground hover:bg-surface-elevated"
            }`}
          >
            {bucketLabel(b)}
          </button>
        ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label="Registrados"
          value={state.status === "ready" ? state.data.usersTotal : "…"}
          hint="Total de usuarios"
        />
        <MetricCard
          label="Conectados ahora"
          value={state.status === "ready" ? state.data.onlineNow : "…"}
          hint="Ventana ~5 minutos"
        />
        <MetricCard
          label="Publicaciones"
          value={state.status === "ready" ? state.data.servicesTotal : "…"}
          hint="Total creadas"
        />
        <MetricCard
          label="En revisión"
          value={state.status === "ready" ? state.data.inReview : "…"}
          hint="Moderación pendiente"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-white p-4 shadow-sm">
          <div className="mb-3">
            <p className="text-sm font-semibold text-foreground">Registrados por {bucketLabel(bucket).toLowerCase()}</p>
            <p className="text-xs text-muted">
              Nuevos en rango actual:{" "}
              <span className="font-semibold text-foreground">
                {state.status === "ready" ? state.data.newUsers : "…"}
              </span>
            </p>
          </div>
          <div ref={usersChartRef} className="h-64 w-full">
            {usersChartReady ? (
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={1}>
                <LineChart data={chartUsers} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.08)" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full w-full animate-pulse rounded-xl bg-surface-elevated" />
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-white p-4 shadow-sm">
          <div className="mb-3">
            <p className="text-sm font-semibold text-foreground">Publicaciones por {bucketLabel(bucket).toLowerCase()}</p>
            <p className="text-xs text-muted">
              Nuevas en rango actual:{" "}
              <span className="font-semibold text-foreground">
                {state.status === "ready" ? state.data.newServices : "…"}
              </span>
            </p>
          </div>
          <div ref={servicesChartRef} className="h-64 w-full">
            {servicesChartReady ? (
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={1}>
                <BarChart data={chartServices} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.08)" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#16a34a" radius={[10, 10, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full w-full animate-pulse rounded-xl bg-surface-elevated" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

