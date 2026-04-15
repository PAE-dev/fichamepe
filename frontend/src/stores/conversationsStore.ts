"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { mockConversations } from "@/data/mockConversations";
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
  sendMessage: (conversationId: string, text: string) => void;
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
  }) => void;
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

function initialsFromName(fullName: string): string {
  const cleaned = fullName.trim();
  if (!cleaned) return "US";
  const parts = cleaned.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0]!.slice(0, 1)}${parts[1]!.slice(0, 1)}`.toUpperCase();
  }
  return cleaned.slice(0, 2).toUpperCase();
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
      openOrCreateConversationFromService: ({
        serviceId,
        serviceTitle,
        serviceCoverImageUrl,
        servicePrice,
        servicePreviousPrice,
        serviceCategory,
        serviceDeliveryTime,
        participant,
      }) =>
        set((state) => {
          const existing = state.conversations.find(
            (conversation) =>
              conversation.serviceId === serviceId &&
              conversation.participant.id === participant.id,
          );
          if (existing) {
            const uid = useAuthStore.getState().user?.id;
            const needsPatch = Boolean(uid) && (!existing.sellerUserId || !existing.buyerUserId);
            const patched: ConversationThread = {
              ...existing,
              ...(needsPatch
                ? {
                    serviceId: existing.serviceId ?? serviceId,
                    sellerUserId: existing.sellerUserId ?? participant.id,
                    buyerUserId: existing.buyerUserId ?? uid,
                  }
                : {}),
              serviceCoverImageUrl:
                existing.serviceCoverImageUrl ?? serviceCoverImageUrl ?? null,
              servicePrice: existing.servicePrice ?? servicePrice ?? null,
              servicePreviousPrice:
                existing.servicePreviousPrice ?? servicePreviousPrice ?? null,
              serviceCategory: existing.serviceCategory ?? serviceCategory ?? null,
              serviceDeliveryTime:
                existing.serviceDeliveryTime ?? serviceDeliveryTime ?? null,
            };
            const conversations = state.conversations.map((c) =>
              c.id === patched.id ? patched : c,
            );
            return {
              conversations: markRead(conversations, patched.id),
              activeConversationId: patched.id,
              dockConversationId: patched.id,
              isDockCollapsed: false,
            };
          }

          const conversationId = `conv-${serviceId}`;
          const buyerUserId = useAuthStore.getState().user?.id ?? undefined;
          const newConversation: ConversationThread = {
            id: conversationId,
            serviceId,
            sellerUserId: participant.id,
            buyerUserId,
            participant: {
              id: participant.id,
              fullName: participant.fullName,
              initials: initialsFromName(participant.fullName),
              avatarUrl: participant.avatarUrl ?? null,
            },
            serviceTitle,
            serviceCoverImageUrl: serviceCoverImageUrl ?? null,
            servicePrice: servicePrice ?? null,
            servicePreviousPrice: servicePreviousPrice ?? null,
            serviceCategory: serviceCategory ?? null,
            serviceDeliveryTime: serviceDeliveryTime ?? null,
            unreadCount: 0,
            messages: [
              {
                id: `msg-${conversationId}-init`,
                sender: "me",
                text: `Hola ${participant.fullName.split(" ")[0] ?? "!"}, vi tu publicación "${serviceTitle}" y me gustaría conversar sobre el servicio.`,
                createdAt: new Date().toISOString(),
              },
            ],
          };

          const conversations = withSortedConversations([
            newConversation,
            ...state.conversations,
          ]);
          return {
            conversations,
            activeConversationId: conversationId,
            dockConversationId: conversationId,
            isDockCollapsed: false,
          };
        }),
      unreadTotal: () =>
        get().conversations.reduce((total, conversation) => total + conversation.unreadCount, 0),
    }),
    { name: "fichame-conversations" },
  ),
);

