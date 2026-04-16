"use client";

import { useEffect, useState } from "react";
import { Mail, X } from "lucide-react";
import { Button } from "@heroui/react/button";
import { useResendVerificationEmail } from "@/hooks/use-resend-verification-email";
import { useAuthStore } from "@/store/auth.store";

function bannerDismissKey(userId: string) {
  return `fichamepe:dismissedEmailVerificationBanner:${userId}`;
}

export function EmailVerificationBanner() {
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { pending, feedback, resend, clearFeedback } = useResendVerificationEmail();
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (!user?.id) return;
    try {
      setDismissed(localStorage.getItem(bannerDismissKey(user.id)) === "1");
    } catch {
      setDismissed(false);
    }
  }, [user?.id]);

  if (!isAuthenticated || !user || user.emailVerified !== false || dismissed) {
    return null;
  }

  const onDismiss = () => {
    try {
      localStorage.setItem(bannerDismissKey(user.id), "1");
    } catch {
      /* ignore */
    }
    setDismissed(true);
  };

  return (
    <div
      role="status"
      className="relative border-b border-primary/15 bg-gradient-to-r from-[#f7f4ff] via-white to-[#f4f2fb] px-4 py-3 text-center text-sm text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.85)] sm:text-left"
    >
      <button
        type="button"
        onClick={onDismiss}
        className="absolute right-2 top-2 inline-flex size-8 items-center justify-center rounded-full text-muted transition hover:bg-primary/10 hover:text-foreground"
        aria-label="Cerrar aviso de verificación"
      >
        <X className="size-4" strokeWidth={2} aria-hidden />
      </button>
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-2 pr-10 sm:flex-row sm:justify-between sm:gap-4 sm:pr-12">
        <p className="flex items-start gap-2 text-left font-medium leading-snug text-foreground/90">
          <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Mail className="size-4" aria-hidden />
          </span>
          <span>
            Verifica tu correo para publicar servicios o escribir en conversaciones. Revisa también la carpeta de
            spam.
          </span>
        </p>
        <div className="flex w-full shrink-0 flex-col items-stretch gap-1 sm:w-auto sm:items-end">
          <Button
            type="button"
            size="sm"
            variant="primary"
            className="rounded-full bg-gradient-to-r from-primary to-primary-light px-4 font-semibold text-white shadow-sm hover:opacity-95"
            isPending={pending}
            onPress={() => {
              clearFeedback();
              void resend();
            }}
          >
            Reenviar correo
          </Button>
          {feedback ? (
            <span className="max-w-xs text-xs text-muted">{feedback}</span>
          ) : null}
        </div>
      </div>
    </div>
  );
}
