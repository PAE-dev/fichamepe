import type { ConversationThread } from "@/types/conversation.types";

export const mockConversations: ConversationThread[] = [
  {
    id: "conv-tech-landing",
    participant: {
      id: "user-camila-vega",
      fullName: "Camila Vega",
      initials: "CV",
      avatarUrl: null,
    },
    serviceTitle: "Landing page para marca personal",
    unreadCount: 2,
    messages: [
      {
        id: "msg-1",
        sender: "other",
        text: "Hola, vi tu perfil. Necesito una landing para lanzar mi marca.",
        createdAt: "2026-04-14T12:10:00.000Z",
      },
      {
        id: "msg-2",
        sender: "me",
        text: "Hola Camila, claro. Te puedo ayudar con diseno y desarrollo.",
        createdAt: "2026-04-14T12:14:00.000Z",
      },
      {
        id: "msg-3",
        sender: "other",
        text: "Buenazo, ¿en cuánto tiempo la tienes lista?",
        createdAt: "2026-04-14T12:18:00.000Z",
      },
      {
        id: "msg-4",
        sender: "other",
        text: "También quisiera incluir formulario de contacto.",
        createdAt: "2026-04-14T12:20:00.000Z",
      },
    ],
  },
  {
    id: "conv-design-reels",
    participant: {
      id: "user-diego-rios",
      fullName: "Diego Rios",
      initials: "DR",
      avatarUrl: null,
    },
    serviceTitle: "Edicion de reels para Instagram",
    unreadCount: 1,
    messages: [
      {
        id: "msg-5",
        sender: "me",
        text: "Te comparti una propuesta con 4 reels mensuales.",
        createdAt: "2026-04-14T10:00:00.000Z",
      },
      {
        id: "msg-6",
        sender: "other",
        text: "Perfecto. ¿Podemos iniciar esta semana?",
        createdAt: "2026-04-14T11:45:00.000Z",
      },
    ],
  },
  {
    id: "conv-music-jingle",
    participant: {
      id: "user-lucia-prado",
      fullName: "Lucia Prado",
      initials: "LP",
      avatarUrl: null,
    },
    serviceTitle: "Jingle comercial de 20 segundos",
    unreadCount: 0,
    messages: [
      {
        id: "msg-7",
        sender: "other",
        text: "Gracias por el entregable. Suena muy bien.",
        createdAt: "2026-04-13T21:05:00.000Z",
      },
      {
        id: "msg-8",
        sender: "me",
        text: "Excelente, cualquier ajuste me escribes por aqui.",
        createdAt: "2026-04-13T21:20:00.000Z",
      },
    ],
  },
];

