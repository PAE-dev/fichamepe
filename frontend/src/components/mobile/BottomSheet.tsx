"use client";

import { Drawer } from "@heroui/react/drawer";
import { useOverlayState } from "@heroui/react";

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
      <Drawer.Trigger className="rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground">
        {triggerLabel}
      </Drawer.Trigger>
      <Drawer.Backdrop isDismissable>
        <Drawer.Content placement="bottom" className="max-h-[80vh]">
          <Drawer.Dialog className="rounded-t-2xl border border-border bg-surface">
            <Drawer.Header className="border-b border-border px-4 py-3">
              <Drawer.Heading className="text-base font-semibold">{title}</Drawer.Heading>
              <Drawer.CloseTrigger aria-label="Cerrar" />
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
