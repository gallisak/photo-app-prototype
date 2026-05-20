import { create } from 'zustand';

export interface ChatMessage {
  id: string;
  authorName: string;
  lastMessage: string;
  avatarUrl: string;
}

interface ChatState {
  chats: ChatMessage[];
}

export const useChatStore = create<ChatState>(() => ({
  chats: [
    {
      id: '1',
      authorName: 'James',
      lastMessage: 'Thank you! That was very helpful!',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150',
    },
    {
      id: '2',
      authorName: 'Will Kenny',
      lastMessage: 'I know... I’m trying to get the funds.',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150',
    },
    {
      id: '3',
      authorName: 'Beth Williams',
      lastMessage: 'I’m looking for tips around capturing the milky way. I have a 6D with a 24-100mm...',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150',
    },
    {
      id: '4',
      authorName: 'Rev Shawn',
      lastMessage: 'Wanted to ask if you’re available for a portrait shoot next week.',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150',
    },
  ],
}));