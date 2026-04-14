"use client";

import type { ConversationMessage } from "@/types/conversation.types";

type MessageBubbleProps = {
  message: ConversationMessage;
};

export function MessageBubble({ message }: MessageBubbleProps) {
  const mine = message.sender === "me";
  return (
    <div className={`flex ${mine ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm ${
          mine ? "rounded-br-md bg-primary text-white" : "rounded-bl-md bg-accent text-foreground"
        }`}
      >
        {message.text}
      </div>
    </div>
  );
}

