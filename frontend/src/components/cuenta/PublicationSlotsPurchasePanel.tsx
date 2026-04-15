"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { Infinity, Layers, Package, ShoppingBag, Sparkles, Wallet } from "lucide-react";
import { Button } from "@heroui/react/button";
import { Card } from "@heroui/react/card";
import { fetchAuthMe, parseApiErrorMessage } from "@/lib/api/auth.api";
import {
  fetchMyPublicationSlotPurchases,
  postPublicationSlotPurchase,
  type PublicationSlotPurchaseRow,
} from "@/lib/api/publication-slot-purchases.api";
import { useAuthStore } from "@/store/auth.store";

type Tone = "light" | "dark";

type Props = {
  className?: string;
  tone?: Tone;
  embedded?: boolean;
  /** Contenido destacado en el centro (p. ej. Plan Pro) entre las dos ofertas de slots. */
  centerColumn?: ReactNode;
};

function featureRow(
  Icon: typeof Sparkles,
  title: string,
  subtitle: string | null,
  tone: Tone,
) {
  const iconWrap =
    tone === "dark"
      ? "border-marketing-line bg-marketing-glass-strong text-marketing-on"
      : "border-border bg-primary/[0.07] text-primary";
  const titleCls = tone === "dark" ? "text-marketing-on" : "text-foreground";
  const subCls = tone === "dark" ? "text-marketing-on-muted" : "text-muted";
  return (
    <li className="flex gap-3">
      <span
        className={`flex size-9 shrink-0 items-center justify-center rounded-full border ${iconWrap}`}
        aria-hidden
      >
        <Icon className="size-4" strokeWidth={2} />
      </span>
      <span className="min-w-0 pt-0.5">
        <span className={`block text-sm font-semibold leading-snug ${titleCls}`}>{title}</span>
        {subtitle ? <span className={`mt-0.5 block text-xs leading-relaxed ${subCls}`}>{subtitle}</span> : null}
      </span>
    </li>
  );
}

export function PublicationSlotsPurchasePanel({
  className = "",
  tone = "light",
  embedded = false,
  centerColumn,
}: Props) {
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const [slotOrders, setSlotOrders] = useState<PublicationSlotPurchaseRow[]>([]);
  const [slotBusy, setSlotBusy] = useState(false);
  const [slotMsg, setSlotMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  const isTriple = Boolean(centerColumn);

  useEffect(() => {
    if (!user || user.isPublicationExempt) {
      return;
    }
    let cancelled = false;
    void (async () => {
      try {
        const o = await fetchMyPublicationSlotPurchases();
        if (!cancelled) setSlotOrders(o);
      } catch {
        if (!cancelled) setSlotOrders([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user]);

  const refreshSlotOrders = async () => {
    try {
      setSlotOrders(await fetchMyPublicationSlotPurchases());
    } catch {
      setSlotOrders([]);
    }
  };

  const requestSlotPurchase = async (kind: "single" | "pack3") => {
    setSlotBusy(true);
    setSlotMsg(null);
    try {
      await postPublicationSlotPurchase({ kind });
      const me = await fetchAuthMe();
      setUser(me);
      await refreshSlotOrders();
      setSlotMsg({
        type: "ok",
        text:
          "Pedido registrado. Completa el pago según las instrucciones que te envíe el equipo; cuando lo verifiquen, sumaremos los slots a tu cuenta.",
      });
    } catch (e) {
      setSlotMsg({
        type: "err",
        text: parseApiErrorMessage(e, "No pudimos crear el pedido."),
      });
    } finally {
      setSlotBusy(false);
    }
  };

  if (!user || user.isPublicationExempt) {
    return null;
  }

  const isDark = tone === "dark";
  const outer = isDark ? "" : `rounded-2xl border border-border bg-surface p-5 shadow-sm sm:p-6 ${className}`;
  const heading = isDark ? "text-marketing-on" : "text-foreground";
  const lead = isDark ? "text-marketing-on-muted" : "text-muted";
  const priceMain = isDark ? "text-marketing-on" : "text-foreground";
  const planBadge =
    "inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary";
  const badgePack =
    "inline-flex items-center rounded-full border border-primary/25 bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary";

  const outlineBtn =
    isDark
      ? "border-marketing-line bg-marketing-glass text-marketing-on hover:bg-marketing-glass-strong"
      : "border-border bg-surface";

  /** Ofertas laterales: mismo peso visual, sin competir con el plan central. */
  const cardShellLight =
    "h-full min-h-0 flex-col gap-0 border border-border/80 bg-muted/[0.04] p-5 shadow-sm transition-shadow hover:border-primary/20 hover:shadow-md";
  const cardShellPackLight =
    "h-full min-h-0 flex-col gap-0 border border-primary/20 bg-surface p-5 shadow-sm transition-shadow hover:border-primary/35 hover:shadow-md";
  const cardShellDark =
    "h-full min-h-0 flex-col gap-0 border border-marketing-line bg-marketing-glass p-5 shadow-inner backdrop-blur-sm";
  const cardShellPackDark =
    "h-full min-h-0 flex-col gap-0 border border-marketing-line bg-marketing-glass-strong/80 p-5 shadow-inner backdrop-blur-sm transition-shadow hover:border-primary/40";

  const slotCardsGrid = (
    <div
      className={
        isTriple
          ? "grid grid-cols-1 items-stretch gap-5 md:grid-cols-3 md:items-stretch md:gap-6"
          : "grid gap-4 sm:grid-cols-2"
      }
    >
      <Card variant="default" className={isDark ? cardShellDark : cardShellLight}>
        <Card.Header className="border-0 p-0">
          <span className={planBadge}>Plan 1</span>
          <Card.Title className={`mt-2 text-base font-bold ${priceMain}`}>Publicación individual</Card.Title>
          <p className={`mt-1 text-3xl font-extrabold tabular-nums tracking-tight ${priceMain}`}>
            S/&nbsp;19
          </p>
          <Card.Description className={`mt-2 text-sm font-medium leading-snug ${heading}`}>
            Activa un anuncio y consigue clientes ya.
          </Card.Description>
        </Card.Header>
        <Card.Content className="flex flex-1 flex-col px-0 pt-4 pb-0">
          <ul className="min-h-0 flex-1 space-y-3">
            {featureRow(Infinity, "1 publicación activa permanente", null, tone)}
            {featureRow(Wallet, "Pago único, sin renovación", null, tone)}
            {featureRow(Sparkles, "Ideal para probar rápido", null, tone)}
          </ul>
        </Card.Content>
        <Card.Footer className="mt-auto flex-col border-0 p-0 pt-4">
          <Button
            type="button"
            variant="outline"
            className={`w-full rounded-full font-semibold ${outlineBtn}`}
            isDisabled={slotBusy}
            onPress={() => void requestSlotPurchase("single")}
          >
            Publicar ahora
          </Button>
        </Card.Footer>
      </Card>

      {isTriple ? (
        <div className="relative flex min-h-0 min-w-0 flex-col md:z-10 md:-my-1 md:py-1">{centerColumn}</div>
      ) : null}

      <Card variant="default" className={isDark ? cardShellPackDark : cardShellPackLight}>
        <Card.Header className="border-0 p-0">
          <div className="flex w-full flex-wrap items-center justify-between gap-2">
            <span className={planBadge}>Plan 3</span>
            <span className={badgePack}>Mejor valor</span>
          </div>
          <Card.Title className={`mt-2 text-base font-bold ${priceMain}`}>Pack ahorro</Card.Title>
          <p className={`mt-1 text-3xl font-extrabold tabular-nums tracking-tight ${priceMain}`}>
            S/&nbsp;49
          </p>
          <Card.Description className={`mt-2 text-sm font-medium leading-snug ${heading}`}>
            Más publicaciones al mejor precio.
          </Card.Description>
        </Card.Header>
        <Card.Content className="flex flex-1 flex-col px-0 pt-4 pb-0">
          <ul className="min-h-0 flex-1 space-y-3">
            {featureRow(Layers, "3 publicaciones permanentes", null, tone)}
            {featureRow(Wallet, "Pagas una vez, usas siempre", null, tone)}
            {featureRow(Package, "Ahorro frente a comprar por separado", null, tone)}
          </ul>
        </Card.Content>
        <Card.Footer className="mt-auto flex-col border-0 p-0 pt-4">
          <Button
            type="button"
            variant="primary"
            className="w-full rounded-full bg-primary font-semibold text-white shadow-md shadow-primary/25 hover:opacity-95"
            isDisabled={slotBusy}
            onPress={() => void requestSlotPurchase("pack3")}
          >
            Comprar pack
          </Button>
        </Card.Footer>
      </Card>
    </div>
  );

  const messagesBlock = (
    <>
      {slotMsg ? (
        <p
          className={`rounded-xl px-3 py-2 text-sm ${
            slotMsg.type === "ok"
              ? isDark
                ? "bg-success/15 text-marketing-on"
                : "bg-success/10 text-success"
              : isDark
                ? "bg-accent-red/15 text-marketing-on"
                : "text-accent-red"
          }`}
          role="status"
        >
          {slotMsg.text}
        </p>
      ) : null}
      {slotOrders.some((o) => o.status === "pending_payment") ? (
        <div
          className={`rounded-xl border px-3 py-3 text-xs ${
            isDark
              ? "border-accent/35 bg-accent/10 text-marketing-on"
              : "border-border bg-muted/10 text-muted"
          }`}
        >
          <p className={`font-semibold ${isDark ? "text-marketing-on" : "text-foreground"}`}>
            Pedidos pendientes de verificación
          </p>
          <ul className="mt-2 space-y-1">
            {slotOrders
              .filter((o) => o.status === "pending_payment")
              .map((o) => (
                <li key={o.id} className="flex flex-wrap items-baseline gap-x-2">
                  <span className="font-medium">{o.kind === "single" ? "+1 slot" : "Pack +3"}</span>
                  <span className="tabular-nums opacity-80">S/ {o.amountPen}</span>
                  <span className="font-mono text-[10px] opacity-70">{o.id.slice(0, 8)}…</span>
                </li>
              ))}
          </ul>
        </div>
      ) : null}
    </>
  );

  const inner = (
    <div className="space-y-5">
      {isTriple ? (
        <>
          <h3 id="slots-purchase-heading" className="sr-only">
            Planes de publicación: individual, Pro y pack ahorro
          </h3>
          <p className={`text-sm leading-relaxed ${lead}`}>
            Tres formas de crecer: <strong className={heading}>una ficha</strong>,{" "}
            <strong className={heading}>visibilidad mensual</strong> o{" "}
            <strong className={heading}>pack permanente</strong>. El equipo verifica cada pago antes de sumar las
            publicaciones a tu cuenta.
          </p>
        </>
      ) : (
        <div className="flex items-start gap-3">
          <span
            className={`flex size-11 shrink-0 items-center justify-center rounded-2xl ${
              isDark ? "bg-marketing-glass-strong text-marketing-on" : "bg-primary/10 text-primary"
            }`}
          >
            <ShoppingBag className="size-5" aria-hidden />
          </span>
          <div className="min-w-0">
            <h3 id="slots-purchase-heading" className={`text-lg font-bold tracking-tight ${heading}`}>
              Más publicaciones activas
            </h3>
            <p className={`mt-1 text-sm leading-relaxed ${lead}`}>
              Elige <strong className={isDark ? "text-marketing-on" : "text-foreground"}>Plan 1</strong> o{" "}
              <strong className={isDark ? "text-marketing-on" : "text-foreground"}>Plan 3</strong>: publicaciones
              permanentes que no caducan con la mensualidad.
            </p>
          </div>
        </div>
      )}

      {slotCardsGrid}

      {messagesBlock}
    </div>
  );

  if (isDark || embedded) {
    return (
      <div className={className} role="region" aria-labelledby="slots-purchase-heading">
        {inner}
      </div>
    );
  }

  return (
    <section className={outer} aria-labelledby="slots-purchase-heading">
      {inner}
    </section>
  );
}
