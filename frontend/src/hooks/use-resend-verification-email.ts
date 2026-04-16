"use client";

import { useCallback, useState } from "react";
import { parseApiErrorMessage, postResendVerificationEmail } from "@/lib/api/auth.api";

export function useResendVerificationEmail() {
  const [pending, setPending] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const resend = useCallback(async () => {
    setFeedback(null);
    setPending(true);
    try {
      const r = await postResendVerificationEmail();
      setFeedback(r.message);
    } catch (e) {
      setFeedback(parseApiErrorMessage(e, "No pudimos reenviar el correo."));
    } finally {
      setPending(false);
    }
  }, []);

  const clearFeedback = useCallback(() => setFeedback(null), []);

  return { pending, feedback, resend, clearFeedback };
}
