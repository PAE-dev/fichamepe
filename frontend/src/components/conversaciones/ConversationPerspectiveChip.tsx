"use client";

import type { ConversationPerspective } from "@/components/conversaciones/conversation-utils";
import { perspectiveLabel } from "@/components/conversaciones/conversation-utils";

export function ConversationPerspectiveChip({
  perspective,
}: {
  perspective: ConversationPerspective | null;
}) {
  if (!perspective) return null;
  return (
    <span
      className={`inline-flex shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
        perspective === "buyer"
          ? "border border-primary/25 bg-primary/[0.09] text-primary"
          : "border border-primary/30 bg-primary/[0.14] text-primary-dark"
      }`}
    >
      {perspectiveLabel(perspective)}
    </span>
  );
}
