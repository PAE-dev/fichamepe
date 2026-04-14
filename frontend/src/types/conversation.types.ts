export type ConversationMessage = {
  id: string;
  sender: "me" | "other";
  text: string;
  createdAt: string;
};

export type ConversationParticipant = {
  id: string;
  fullName: string;
  initials: string;
  avatarUrl?: string | null;
};

export type ConversationThread = {
  id: string;
  participant: ConversationParticipant;
  serviceTitle: string;
  unreadCount: number;
  messages: ConversationMessage[];
};
