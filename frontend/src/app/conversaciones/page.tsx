"use client";

import { FormEvent, useMemo, useState } from "react";
import { ArrowLeft, Send } from "lucide-react";
import { Footer } from "@/components/layout/Footer";
import { BottomNav } from "@/components/layout/BottomNav";
import { Navbar } from "@/components/layout/Navbar";
import { ConversationListItem } from "@/components/conversaciones/ConversationListItem";
import { MessageBubble } from "@/components/conversaciones/MessageBubble";
import { useConversationsStore } from "@/stores/conversationsStore";

export default function ConversacionesPage() {
  const [draft, setDraft] = useState("");
  const [mobileConversationId, setMobileConversationId] = useState<string | null>(null);
  const conversations = useConversationsStore((state) => state.conversations);
  const activeConversationId = useConversationsStore((state) => state.activeConversationId);
  const setActiveConversation = useConversationsStore((state) => state.setActiveConversation);
  const sendMessage = useConversationsStore((state) => state.sendMessage);

  const desktopConversation = useMemo(
    () => conversations.find((conversation) => conversation.id === activeConversationId) ?? null,
    [conversations, activeConversationId],
  );
  const mobileConversation = useMemo(
    () => conversations.find((conversation) => conversation.id === mobileConversationId) ?? null,
    [conversations, mobileConversationId],
  );

  const submitMessage = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const targetConversation = mobileConversation ?? desktopConversation;
    if (!targetConversation) return;
    const cleaned = draft.trim();
    if (!cleaned) return;
    sendMessage(targetConversation.id, cleaned);
    setDraft("");
  };

  return (
    <div className="flex min-h-full flex-col bg-background">
      <Navbar />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6">
        <div className="mb-4">
          <h1 className="text-2xl font-extrabold text-foreground sm:text-3xl">Conversaciones</h1>
          <p className="mt-1 text-sm text-muted">
            Gestiona tus chats y responde rapido a tus clientes.
          </p>
        </div>

        <section className="hidden min-h-[620px] overflow-hidden rounded-2xl border border-border bg-white md:grid md:grid-cols-[320px_1fr]">
          <aside className="border-r border-border bg-background/50 p-3">
            <div className="space-y-2">
              {conversations.map((conversation) => (
                <ConversationListItem
                  key={conversation.id}
                  conversation={conversation}
                  isActive={conversation.id === desktopConversation?.id}
                  onClick={() => setActiveConversation(conversation.id)}
                />
              ))}
            </div>
          </aside>

          <div className="flex min-h-0 flex-col">
            {desktopConversation ? (
              <>
                <header className="border-b border-border px-5 py-4">
                  <h2 className="text-base font-semibold text-foreground">
                    {desktopConversation.participant.fullName}
                  </h2>
                  <p className="text-xs text-muted">{desktopConversation.serviceTitle}</p>
                </header>
                <div className="flex-1 space-y-2 overflow-y-auto bg-background px-5 py-4">
                  {desktopConversation.messages.map((message) => (
                    <MessageBubble key={message.id} message={message} />
                  ))}
                </div>
                <form onSubmit={submitMessage} className="border-t border-border p-4">
                  <div className="flex items-center gap-2">
                    <input
                      value={draft}
                      onChange={(event) => setDraft(event.target.value)}
                      placeholder="Escribe tu mensaje y presiona Enter"
                      className="h-11 w-full rounded-full border border-border bg-white px-4 text-sm text-foreground outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/20"
                    />
                    <button
                      type="submit"
                      className="inline-flex size-11 items-center justify-center rounded-full bg-primary text-white transition hover:opacity-95"
                      aria-label="Enviar mensaje"
                    >
                      <Send className="size-4" aria-hidden />
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="flex h-full items-center justify-center p-8 text-sm text-muted">
                Selecciona una conversación para empezar.
              </div>
            )}
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-white p-3 md:hidden">
          {!mobileConversation ? (
            <div className="space-y-2">
              {conversations.map((conversation) => (
                <ConversationListItem
                  key={conversation.id}
                  conversation={conversation}
                  onClick={() => {
                    setActiveConversation(conversation.id);
                    setMobileConversationId(conversation.id);
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="flex min-h-[70vh] flex-col">
              <header className="mb-3 flex items-center gap-2 border-b border-border pb-3">
                <button
                  type="button"
                  className="inline-flex size-9 items-center justify-center rounded-full border border-border text-muted transition hover:border-primary/40 hover:text-primary"
                  onClick={() => setMobileConversationId(null)}
                  aria-label="Volver a conversaciones"
                >
                  <ArrowLeft className="size-4" aria-hidden />
                </button>
                <div className="min-w-0">
                  <h2 className="truncate text-sm font-semibold text-foreground">
                    {mobileConversation.participant.fullName}
                  </h2>
                  <p className="truncate text-xs text-muted">{mobileConversation.serviceTitle}</p>
                </div>
              </header>
              <div className="flex-1 space-y-2 overflow-y-auto bg-background px-1 py-2">
                {mobileConversation.messages.map((message) => (
                  <MessageBubble key={message.id} message={message} />
                ))}
              </div>
              <form onSubmit={submitMessage} className="mt-3 border-t border-border pt-3">
                <div className="flex items-center gap-2">
                  <input
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                    placeholder="Escribe un mensaje"
                    className="h-10 w-full rounded-full border border-border bg-white px-3 text-sm text-foreground outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/20"
                  />
                  <button
                    type="submit"
                    className="inline-flex size-10 items-center justify-center rounded-full bg-primary text-white transition hover:opacity-95"
                    aria-label="Enviar mensaje"
                  >
                    <Send className="size-4" aria-hidden />
                  </button>
                </div>
              </form>
            </div>
          )}
        </section>
      </main>
      <Footer />
      <BottomNav />
    </div>
  );
}

