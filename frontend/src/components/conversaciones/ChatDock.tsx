"use client";

import { FormEvent, useMemo, useState } from "react";
import { ChevronDown, ChevronUp, Send, X } from "lucide-react";
import { ConversationPerspectiveChip } from "@/components/conversaciones/ConversationPerspectiveChip";
import { ConversationServiceCover } from "@/components/conversaciones/ConversationServiceCover";
import { MessageBubble } from "@/components/conversaciones/MessageBubble";
import { getConversationPerspective } from "@/components/conversaciones/conversation-utils";
import { useAuthStore } from "@/store/auth.store";
import { useConversationsStore } from "@/stores/conversationsStore";

export function ChatDock() {
  const userId = useAuthStore((s) => s.user?.id ?? null);
  const [draft, setDraft] = useState("");
  const dockConversationId = useConversationsStore((state) => state.dockConversationId);
  const isDockCollapsed = useConversationsStore((state) => state.isDockCollapsed);
  const conversations = useConversationsStore((state) => state.conversations);
  const setDockCollapsed = useConversationsStore((state) => state.setDockCollapsed);
  const closeDockConversation = useConversationsStore((state) => state.closeDockConversation);
  const sendMessage = useConversationsStore((state) => state.sendMessage);

  const conversation = useMemo(
    () => conversations.find((item) => item.id === dockConversationId) ?? null,
    [conversations, dockConversationId],
  );

  if (!conversation) return null;

  const perspective = getConversationPerspective(conversation, userId);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const cleaned = draft.trim();
    if (!cleaned) return;
    try {
      await sendMessage(conversation.id, cleaned);
      setDraft("");
    } catch {
      /* el interceptor de axios ya maneja 401; otros errores se ignoran aquí */
    }
  };

  return (
    <div className="fixed bottom-0 right-4 z-[60] w-[min(100vw-16px,360px)] rounded-t-2xl border border-border bg-white shadow-2xl">
      <div className="flex items-center justify-between border-b border-border px-3 py-2">
        <div className="flex min-w-0 flex-1 items-start gap-2.5">
          <ConversationServiceCover
            coverUrl={conversation.serviceCoverImageUrl}
            serviceTitle={conversation.serviceTitle}
            initialsFallback={conversation.participant.initials}
            perspective={perspective}
            size="sm"
          />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-1.5">
              <p className="truncate text-sm font-semibold text-foreground">
                {conversation.participant.fullName}
              </p>
              <ConversationPerspectiveChip perspective={perspective} />
            </div>
            <p className="mt-0.5 truncate text-[11px] font-semibold leading-snug text-foreground/85">
              {conversation.serviceTitle}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            className="inline-flex size-8 items-center justify-center rounded-full text-muted transition hover:bg-primary/5 hover:text-primary"
            onClick={() => setDockCollapsed(!isDockCollapsed)}
            aria-label={isDockCollapsed ? "Expandir chat" : "Contraer chat"}
          >
            {isDockCollapsed ? (
              <ChevronUp className="size-4" aria-hidden />
            ) : (
              <ChevronDown className="size-4" aria-hidden />
            )}
          </button>
          <button
            type="button"
            className="inline-flex size-8 items-center justify-center rounded-full text-muted transition hover:bg-primary/5 hover:text-primary"
            onClick={closeDockConversation}
            aria-label="Cerrar chat"
          >
            <X className="size-4" aria-hidden />
          </button>
        </div>
      </div>

      {!isDockCollapsed ? (
        <>
          <div className="h-[300px] space-y-2 overflow-y-auto bg-background px-3 py-3">
            {conversation.messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
          </div>
          <form onSubmit={submit} className="flex items-center gap-2 border-t border-border p-3">
            <input
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Escribe un mensaje..."
              className="h-10 w-full rounded-full border border-border bg-white px-3 text-sm text-foreground outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/20"
            />
            <button
              type="submit"
              className="inline-flex size-10 items-center justify-center rounded-full bg-primary text-white transition hover:opacity-95"
              aria-label="Enviar mensaje"
            >
              <Send className="size-4" aria-hidden />
            </button>
          </form>
        </>
      ) : null}
    </div>
  );
}

