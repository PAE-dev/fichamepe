"use client";

import type { ConversationThread } from "@/types/conversation.types";
import { formatRelativeTime, getLastMessage, getLastMessageDate } from "@/components/conversaciones/conversation-utils";

type ConversationListItemProps = {
  conversation: ConversationThread;
  isActive?: boolean;
  onClick?: () => void;
};

export function ConversationListItem({
  conversation,
  isActive = false,
  onClick,
}: ConversationListItemProps) {
  const preview = getLastMessage(conversation);
  const relative = formatRelativeTime(getLastMessageDate(conversation));

  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full rounded-xl border p-3 text-left transition ${
        isActive
          ? "border-primary/30 bg-primary/5"
          : "border-border bg-white hover:border-primary/30 hover:bg-primary/[0.03]"
      }`}
    >
      <div className="flex items-start gap-3">
        <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/12 text-xs font-bold text-primary">
          {conversation.participant.initials}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <p className="truncate text-sm font-semibold text-foreground">
              {conversation.participant.fullName}
            </p>
            <span className="shrink-0 text-[11px] text-muted">{relative}</span>
          </div>
          <p className="mt-0.5 truncate text-xs text-muted">{conversation.serviceTitle}</p>
          <p className="mt-1 truncate text-xs text-foreground/80">{preview}</p>
        </div>
      </div>
      {conversation.unreadCount > 0 ? (
        <span className="mt-2 inline-flex min-w-5 items-center justify-center rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-bold text-white">
          {conversation.unreadCount}
        </span>
      ) : null}
    </button>
  );
}

