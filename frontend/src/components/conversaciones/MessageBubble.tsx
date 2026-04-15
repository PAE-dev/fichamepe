"use client";

import type { ConversationMessage } from "@/types/conversation.types";
import { useAuthStore } from "@/store/auth.store";

type MessageBubbleProps = {
  message: ConversationMessage;
};

export function MessageBubble({ message }: MessageBubbleProps) {
  const userId = useAuthStore((s) => s.user?.id ?? null);
  const mine = Boolean(userId && message.senderUserId === userId);
  return (
    <div className={`flex ${mine ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
          mine
            ? "rounded-br-md bg-primary text-white shadow-sm"
            : "rounded-bl-md border border-primary/20 bg-white text-foreground shadow-sm"
        }`}
      >
        {message.text}
      </div>
    </div>
  );
}

