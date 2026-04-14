import type { ConversationThread } from "@/types/conversation.types";

export function getLastMessage(conversation: ConversationThread): string {
  return conversation.messages[conversation.messages.length - 1]?.text ?? "";
}

export function getLastMessageDate(conversation: ConversationThread): Date | null {
  const iso = conversation.messages[conversation.messages.length - 1]?.createdAt;
  if (!iso) return null;
  const parsed = new Date(iso);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export function formatRelativeTime(date: Date | null): string {
  if (!date) return "";
  const now = Date.now();
  const diffMs = now - date.getTime();
  const diffMin = Math.max(0, Math.floor(diffMs / 60000));
  if (diffMin < 1) return "Ahora";
  if (diffMin < 60) return `Hace ${diffMin} min`;
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `Hace ${diffHours} h`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `Hace ${diffDays} d`;
  return date.toLocaleDateString("es-PE", {
    day: "2-digit",
    month: "2-digit",
  });
}

