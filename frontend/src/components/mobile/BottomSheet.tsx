"use client";

import { Drawer } from "@heroui/react/drawer";
import { useOverlayState } from "@heroui/react";
import { useEffect } from "react";
import { X } from "lucide-react";

export function BottomSheet({
  triggerLabel,
  title,
  children,
}: {
  triggerLabel: string;
  title: string;
  children: React.ReactNode;
}) {
  const state = useOverlayState();

  useEffect(() => {
    // #region agent log
    fetch("http://127.0.0.1:7907/ingest/4ab00c66-c014-4f05-821f-8a55da88cb2b", {
      method: "POST",
      mode: "no-cors",
      keepalive: true,
      headers: {
        "Content-Type": "application/json",
        "X-Debug-Session-Id": "943a62",
      },
      body: JSON.stringify({
        sessionId: "943a62",
        runId: "run-1",
        hypothesisId: "H4",
        location: "src/components/mobile/BottomSheet.tsx:BottomSheet.useEffect",
        message: "bottomsheet-mounted",
        data: { triggerLabel, isOpen: state.isOpen, path: window.location.pathname },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion
  }, [triggerLabel, state.isOpen]);

  return (
    <Drawer state={state}>
      <Drawer.Trigger
        aria-label={triggerLabel}
        className="rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground transition hover:bg-surface-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
      >
        {triggerLabel}
      </Drawer.Trigger>
      <Drawer.Backdrop isDismissable>
        <Drawer.Content placement="bottom" className="max-h-[80vh]">
          <Drawer.Dialog className="rounded-t-2xl border border-border bg-surface">
            <Drawer.Header className="border-b border-border px-4 py-3">
              <Drawer.Heading className="text-base font-semibold">{title}</Drawer.Heading>
              <Drawer.CloseTrigger
                aria-label="Cerrar"
                className="inline-flex size-9 items-center justify-center rounded-full text-muted transition hover:bg-surface-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
              >
                <X className="size-5" strokeWidth={2} aria-hidden />
              </Drawer.CloseTrigger>
            </Drawer.Header>
            <Drawer.Body className="p-4">{children}</Drawer.Body>
            <Drawer.Footer className="border-t border-border p-4">
              <button
                type="button"
                className="w-full rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white"
                onClick={() => state.close()}
              >
                Ver resultados
              </button>
            </Drawer.Footer>
          </Drawer.Dialog>
        </Drawer.Content>
      </Drawer.Backdrop>
    </Drawer>
  );
}
