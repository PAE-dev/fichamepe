"use client";

import { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { Gift, Link2, Share2, Users } from "lucide-react";
import { Button } from "@heroui/react/button";
import { Input } from "@heroui/react/input";
import { Label } from "@heroui/react/label";
import { fetchAuthMe, parseApiErrorMessage } from "@/lib/api/auth.api";
import { postApplyReferralCode } from "@/lib/api/referrals.api";
import { useAuthStore } from "@/store/auth.store";

function shareUrlForCode(code: string): string {
  if (typeof window === "undefined") return "";
  const u = new URL(window.location.origin);
  u.searchParams.set("ref", code);
  return u.toString();
}

export function CuentaReferidosClient() {
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const [codeInput, setCodeInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [copied, setCopied] = useState<"code" | "link" | null>(null);

  const myCode = user?.referralCode ?? "";
  const link = useMemo(() => shareUrlForCode(myCode), [myCode]);

  const quotaLabel = useMemo(() => {
    if (!user) return "";
    if (user.isPublicationExempt) {
      return "Tu cuenta no tiene límite de publicaciones activas.";
    }
    const max = user.publicationActiveMax ?? 0;
    return `${user.publicationActiveCount} de ${max} publicaciones activas`;
  }, [user]);

  const quotaPct = useMemo(() => {
    if (
      !user ||
      user.isPublicationExempt ||
      user.publicationActiveMax == null ||
      user.publicationActiveMax <= 0
    ) {
      return 0;
    }
    return Math.min(
      100,
      Math.round((user.publicationActiveCount / user.publicationActiveMax) * 100),
    );
  }, [user]);

  const copyText = useCallback(async (text: string, kind: "code" | "link") => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(kind);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      setMessage({ type: "err", text: "No se pudo copiar al portapapeles." });
    }
  }, []);

  const onApplyReferral = async () => {
    if (!user) return;
    const raw = codeInput.trim().toUpperCase();
    if (raw.length < 4) {
      setMessage({ type: "err", text: "Ingresa un código válido." });
      return;
    }
    setBusy(true);
    setMessage(null);
    try {
      await postApplyReferralCode(raw);
      const fresh = await fetchAuthMe();
      setUser(fresh);
      setCodeInput("");
      setMessage({
        type: "ok",
        text: "¡Listo! Apoyaste a tu referidor con tu registro único. Gracias por sumarte.",
      });
    } catch (e) {
      setMessage({
        type: "err",
        text: parseApiErrorMessage(e, "No pudimos aplicar el código."),
      });
    } finally {
      setBusy(false);
    }
  };

  if (!user) {
    return (
      <div className="rounded-2xl border border-border bg-surface-elevated px-6 py-12 text-center">
        <p className="text-sm text-muted">Inicia sesión para ver tus referidos.</p>
        <Link
          href="/"
          className="mt-4 inline-flex h-11 items-center justify-center rounded-full bg-primary px-6 text-sm font-semibold text-white transition hover:opacity-95"
        >
          Volver al inicio
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          <Users className="size-3.5" aria-hidden />
          Programa de referidos
        </div>
        <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">Mis referidos</h2>
        <p className="max-w-2xl text-sm leading-relaxed text-muted">
          Comparte tu código o enlace: cada persona que se registre o se afilie contigo suma un cupo extra
          permanente de publicación <strong className="font-semibold text-foreground">activa</strong> para ti,
          hasta un máximo de <strong className="font-semibold text-foreground">3</strong> por este programa. Tú
          también puedes apoyar a alguien una sola vez con su código.
        </p>
      </header>

      {!user.isPublicationExempt ? (
        <section
          className="rounded-2xl border border-border bg-white p-5 shadow-sm sm:p-6"
          aria-labelledby="quota-heading"
        >
          <h3 id="quota-heading" className="text-sm font-semibold text-foreground">
            Tu cupo de publicaciones
          </h3>
          <p className="mt-1 text-xs text-muted">
            Solo cuentan las fichas en estado <strong className="font-semibold text-foreground">ACTIVA</strong>{" "}
            frente a tu tope. Referidos: hasta +3 permanentes; también puedes comprar slots o un plan mensual
            desde «Mis publicaciones».
          </p>
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-foreground">{quotaLabel}</span>
              <span className="tabular-nums text-muted">{quotaPct}%</span>
            </div>
            <div
              className="h-2.5 overflow-hidden rounded-full bg-muted/25"
              role="progressbar"
              aria-valuenow={quotaPct}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={quotaLabel}
            >
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary to-primary-light transition-all duration-500"
                style={{ width: `${quotaPct}%` }}
              />
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              href="/cuenta/publicaciones"
              className="inline-flex h-10 items-center justify-center rounded-full border border-border bg-white px-5 text-sm font-semibold text-foreground transition hover:bg-primary/[0.06]"
            >
              Ir a mis publicaciones
            </Link>
            {user.referralDirectCount > 0 ? (
              <p className="flex h-10 items-center text-xs text-muted">
                Referidos totales:{" "}
                <span className="ml-1 font-semibold tabular-nums text-foreground">{user.referralDirectCount}</span>
              </p>
            ) : null}
          </div>
        </section>
      ) : (
        <p className="rounded-2xl border border-border bg-primary/[0.06] px-4 py-3 text-sm text-foreground">
          Tu cuenta tiene publicaciones ilimitadas. Igual puedes compartir tu código para ayudar a
          crecer la comunidad.
        </p>
      )}

      <section className="rounded-2xl border border-border bg-white p-5 shadow-sm sm:p-6">
        <div className="flex items-start gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Share2 className="size-5" aria-hidden />
          </span>
          <div className="min-w-0 flex-1 space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Tu código</h3>
              <p className="mt-1 text-xs text-muted">Compártelo tal cual o usa el enlace listo para enviar.</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <code className="block rounded-xl border border-border bg-muted/10 px-4 py-3 text-center text-lg font-bold tracking-widest text-foreground sm:min-w-[200px]">
                {myCode || "—"}
              </code>
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="primary"
                  className="rounded-full"
                  onPress={() => myCode && void copyText(myCode, "code")}
                  isDisabled={!myCode}
                >
                  {copied === "code" ? "Copiado" : "Copiar código"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-full border-border"
                  onPress={() => link && void copyText(link, "link")}
                  isDisabled={!link}
                >
                  <Link2 className="mr-1.5 size-4" aria-hidden />
                  {copied === "link" ? "Enlace copiado" : "Copiar enlace"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-white p-5 shadow-sm sm:p-6">
        <div className="flex items-start gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-success/15 text-success">
            <Gift className="size-5" aria-hidden />
          </span>
          <div className="min-w-0 flex-1 space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Apoya a alguien</h3>
              <p className="mt-1 text-xs leading-relaxed text-muted">
                Solo puedes hacerlo <strong className="font-semibold text-foreground">una vez</strong>. Al
                guardar, quedarás vinculado a ese referidor y él recibirá un cupo extra de publicación.
                No puedes usar tu propio código.
              </p>
            </div>
            {user.hasReferredBy ? (
              <p className="rounded-xl bg-muted/15 px-4 py-3 text-sm text-foreground">
                Ya registraste un código de referido. ¡Gracias por apoyar a la comunidad!
              </p>
            ) : (
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                <div className="min-w-0 flex-1 space-y-2">
                  <Label htmlFor="referral-apply-code" className="text-sm font-medium">
                    Código de otra persona
                  </Label>
                  <Input
                    id="referral-apply-code"
                    value={codeInput}
                    onChange={(e) => setCodeInput(e.target.value.toUpperCase())}
                    placeholder="EJEMPLO123"
                    className="h-11 rounded-xl border-border font-mono uppercase tracking-wide"
                    autoComplete="off"
                    maxLength={16}
                  />
                </div>
                <Button
                  type="button"
                  variant="primary"
                  className="h-11 shrink-0 rounded-full px-6"
                  onPress={() => void onApplyReferral()}
                  isDisabled={busy || codeInput.trim().length < 4}
                >
                  {busy ? "Guardando…" : "Afiliar código"}
                </Button>
              </div>
            )}
            <div aria-live="polite" className="min-h-[1.25rem] text-sm">
              {message ? (
                <p className={message.type === "ok" ? "text-success" : "text-accent-red"}>
                  {message.text}
                </p>
              ) : null}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
