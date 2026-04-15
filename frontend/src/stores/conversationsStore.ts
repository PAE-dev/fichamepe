"use client";

import { create } from "zustand";
import {
  createConversation,
  fetchConversationMessages,
  fetchConversations,
  postConversationMessage,
} from "@/lib/api/conversations.api";
import { useAuthStore } from "@/store/auth.store";
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
  sendMessage: (conversationId: string, text: string) => Promise<void>;
  openOrCreateConversationFromService: (payload: {
    serviceId: string;
    serviceTitle: string;
    serviceCoverImageUrl?: string | null;
    servicePrice?: number | null;
    servicePreviousPrice?: number | null;
    serviceCategory?: string | null;
    serviceDeliveryTime?: string | null;
    participant: {
      id: string;
      fullName: string;
      avatarUrl?: string | null;
    };
  }) => Promise<void>;
  unreadTotal: () => number;
  syncFromApi: () => Promise<void>;
  loadMessagesForConversation: (conversationId: string) => Promise<void>;
  ingestRemoteMessage: (conversationId: string, message: ConversationMessage) => void;
  reset: () => void;
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

function mergeThreadPreservingMessages(
  prev: ConversationThread | undefined,
  next: ConversationThread,
): ConversationThread {
  if (!prev) return next;
  if (prev.messages.length > next.messages.length) {
    return {
      ...next,
      messages: prev.messages,
    };
  }
  return next;
}

export const useConversationsStore = create<ConversationsState>((set, get) => ({
  conversations: [],
  activeConversationId: null,
  dockConversationId: null,
  isDockCollapsed: false,

  reset: () =>
    set({
      conversations: [],
      activeConversationId: null,
      dockConversationId: null,
      isDockCollapsed: false,
    }),

  syncFromApi: async () => {
    if (!useAuthStore.getState().accessToken) return;
    try {
      const list = await fetchConversations();
      set((state) => {
        const merged = list.map((thread) => {
          const prev = state.conversations.find((c) => c.id === thread.id);
          return mergeThreadPreservingMessages(prev, thread);
        });
        const active = state.activeConversationId;
        const still = active && merged.some((c) => c.id === active);
        return {
          conversations: withSortedConversations(merged),
          activeConversationId: still ? active : merged[0]?.id ?? null,
        };
      });
    } catch {
      /* evita romper bootstrap si el backend no está disponible */
    }
  },

  loadMessagesForConversation: async (conversationId: string) => {
    if (!useAuthStore.getState().accessToken) return;
    try {
      const messages = await fetchConversationMessages(conversationId);
      set((state) => ({
        conversations: state.conversations.map((c) =>
          c.id === conversationId ? { ...c, messages } : c,
        ),
      }));
    } catch {
      /* silencioso: la UI sigue mostrando lo que hubiera */
    }
  },

  ingestRemoteMessage: (conversationId, message) => {
    set((state) => ({
      conversations: withSortedConversations(
        state.conversations.map((c) => {
          if (c.id !== conversationId) return c;
          if (c.messages.some((m) => m.id === message.id)) return c;
          return {
            ...c,
            messages: [...c.messages, message].sort((a, b) =>
              a.createdAt.localeCompare(b.createdAt),
            ),
          };
        }),
      ),
    }));
  },

  setActiveConversation: (conversationId) => {
    set((state) => ({
      conversations: markRead(state.conversations, conversationId),
      activeConversationId: conversationId,
    }));
    void get().loadMessagesForConversation(conversationId);
  },

  clearActiveConversation: () => set({ activeConversationId: null }),

  openDockConversation: (conversationId) => {
    set((state) => ({
      conversations: markRead(state.conversations, conversationId),
      activeConversationId: conversationId,
      dockConversationId: conversationId,
      isDockCollapsed: false,
    }));
    void get().loadMessagesForConversation(conversationId);
  },

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

  sendMessage: async (conversationId, text) => {
    const cleaned = text.trim();
    if (!cleaned) return;
    const saved = await postConversationMessage(conversationId, cleaned);
    set((state) => ({
      conversations: withSortedConversations(
        state.conversations.map((c) => {
          if (c.id !== conversationId) return c;
          if (c.messages.some((m) => m.id === saved.id)) return c;
          return {
            ...c,
            messages: [...c.messages, saved].sort((a, b) =>
              a.createdAt.localeCompare(b.createdAt),
            ),
          };
        }),
      ),
      activeConversationId: conversationId,
    }));
  },

  openOrCreateConversationFromService: async ({
    serviceId,
    serviceTitle,
    serviceCoverImageUrl,
    servicePrice,
    servicePreviousPrice,
    serviceCategory,
    serviceDeliveryTime,
    participant,
  }) => {
    const thread = await createConversation({ serviceId });
    const patched: ConversationThread = {
      ...thread,
      serviceTitle: thread.serviceTitle || serviceTitle,
      serviceCoverImageUrl: thread.serviceCoverImageUrl ?? serviceCoverImageUrl ?? null,
      servicePrice: thread.servicePrice ?? servicePrice ?? null,
      servicePreviousPrice: thread.servicePreviousPrice ?? servicePreviousPrice ?? null,
      serviceCategory: thread.serviceCategory ?? serviceCategory ?? null,
      serviceDeliveryTime: thread.serviceDeliveryTime ?? serviceDeliveryTime ?? null,
      participant: {
        ...thread.participant,
        fullName: thread.participant.fullName || participant.fullName,
        avatarUrl: thread.participant.avatarUrl ?? participant.avatarUrl ?? null,
      },
    };

    set((state) => {
      const without = state.conversations.filter((c) => c.id !== patched.id);
      return {
        conversations: withSortedConversations([patched, ...without]),
        activeConversationId: patched.id,
        dockConversationId: patched.id,
        isDockCollapsed: false,
      };
    });
    void get().loadMessagesForConversation(patched.id);
  },

  unreadTotal: () =>
    get().conversations.reduce((total, conversation) => total + conversation.unreadCount, 0),
}));
