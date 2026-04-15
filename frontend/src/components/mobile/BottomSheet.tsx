"use client";

import { Drawer } from "@heroui/react/drawer";
import { useOverlayState } from "@heroui/react";
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

  return (
    <Drawer state={state}>
      <Drawer.Trigger aria-label={triggerLabel}>
        <button
          type="button"
          className="rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground transition hover:bg-surface-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
        >
          {triggerLabel}
        </button>
      </Drawer.Trigger>
      <Drawer.Backdrop isDismissable>
        <Drawer.Content placement="bottom" className="max-h-[80vh]">
          <Drawer.Dialog className="rounded-t-2xl border border-border bg-surface">
            <Drawer.Header className="border-b border-border px-4 py-3">
              <Drawer.Heading className="text-base font-semibold">{title}</Drawer.Heading>
              <Drawer.CloseTrigger aria-label="Cerrar">
                <button
                  type="button"
                  className="inline-flex size-9 items-center justify-center rounded-full text-muted transition hover:bg-surface-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                >
                  <X className="size-5" aria-hidden />
                </button>
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
