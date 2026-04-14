"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { mockConversations } from "@/data/mockConversations";
import type { ConversationMessage, ConversationThread } from "@/types/conversation.types";

type ConversationsState = {
  conversations: ConversationThread[];
  activeConversationId: string | null;
  dockConversationId: string | null;
  isDockCollapsed: boolean;
  setActiveConversation: (conversationId: string) => void;
  clearActiveConversation: () => void;
  openDockConversation: (conversationId: string) => void;
  closeDockConversation: () => void;
  setDockCollapsed: (collapsed: boolean) => void;
  markConversationRead: (conversationId: string) => void;
  sendMessage: (conversationId: string, text: string) => void;
  unreadTotal: () => number;
};

function markRead(conversations: ConversationThread[], conversationId: string): ConversationThread[] {
  return conversations.map((conversation) =>
    conversation.id === conversationId ? { ...conversation, unreadCount: 0 } : conversation,
  );
}

function withSortedConversations(conversations: ConversationThread[]): ConversationThread[] {
  return [...conversations].sort((a, b) => {
    const aLast = a.messages[a.messages.length - 1]?.createdAt ?? "";
    const bLast = b.messages[b.messages.length - 1]?.createdAt ?? "";
    return bLast.localeCompare(aLast);
  });
}

function buildMessage(conversationId: string, text: string): ConversationMessage {
  return {
    id: `msg-${conversationId}-${Date.now()}`,
    sender: "me",
    text,
    createdAt: new Date().toISOString(),
  };
}

export const useConversationsStore = create<ConversationsState>()(
  persist(
    (set, get) => ({
      conversations: withSortedConversations(mockConversations),
      activeConversationId: mockConversations[0]?.id ?? null,
      dockConversationId: null,
      isDockCollapsed: false,
      setActiveConversation: (conversationId) =>
        set((state) => ({
          conversations: markRead(state.conversations, conversationId),
          activeConversationId: conversationId,
        })),
      clearActiveConversation: () => set({ activeConversationId: null }),
      openDockConversation: (conversationId) =>
        set((state) => ({
          conversations: markRead(state.conversations, conversationId),
          activeConversationId: conversationId,
          dockConversationId: conversationId,
          isDockCollapsed: false,
        })),
      closeDockConversation: () =>
        set({
          dockConversationId: null,
          isDockCollapsed: false,
        }),
      setDockCollapsed: (collapsed) => set({ isDockCollapsed: collapsed }),
      markConversationRead: (conversationId) =>
        set((state) => ({
          conversations: markRead(state.conversations, conversationId),
        })),
      sendMessage: (conversationId, text) => {
        const cleaned = text.trim();
        if (!cleaned) return;
        set((state) => {
          const conversations = state.conversations.map((conversation) => {
            if (conversation.id !== conversationId) return conversation;
            return {
              ...conversation,
              messages: [...conversation.messages, buildMessage(conversationId, cleaned)],
            };
          });
          return {
            conversations: withSortedConversations(conversations),
            activeConversationId: conversationId,
          };
        });
      },
      unreadTotal: () =>
        get().conversations.reduce((total, conversation) => total + conversation.unreadCount, 0),
    }),
    { name: "fichame-conversations" },
  ),
);

