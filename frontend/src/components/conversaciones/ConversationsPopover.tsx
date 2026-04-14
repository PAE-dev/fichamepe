"use client";

import Link from "next/link";
import { ConversationListItem } from "@/components/conversaciones/ConversationListItem";
import { useConversationsStore } from "@/stores/conversationsStore";

type ConversationsPopoverProps = {
  onOpenChange: (open: boolean) => void;
};

export function ConversationsPopover({ onOpenChange }: ConversationsPopoverProps) {
  const conversations = useConversationsStore((state) => state.conversations);
  const activeConversationId = useConversationsStore((state) => state.activeConversationId);
  const openDockConversation = useConversationsStore((state) => state.openDockConversation);

  if (!conversations.length) {
    return (
      <div className="w-[340px] rounded-2xl border border-border bg-white p-4 shadow-xl">
        <p className="text-sm text-muted">No hay conversaciones por ahora.</p>
      </div>
    );
  }

  return (
    <div className="w-[340px] rounded-2xl border border-border bg-white p-3 shadow-xl">
      <div className="mb-2 flex items-center justify-between px-1">
        <h3 className="text-sm font-semibold text-foreground">Conversaciones</h3>
        <Link
          href="/conversaciones"
          onClick={() => onOpenChange(false)}
          className="text-xs font-semibold text-primary hover:underline"
        >
          Ver todo
        </Link>
      </div>
      <div className="max-h-[360px] space-y-2 overflow-y-auto pr-1">
        {conversations.map((conversation) => (
          <ConversationListItem
            key={conversation.id}
            conversation={conversation}
            isActive={activeConversationId === conversation.id}
            onClick={() => {
              openDockConversation(conversation.id);
              onOpenChange(false);
            }}
          />
        ))}
      </div>
    </div>
  );
}

