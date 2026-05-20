import { create } from 'zustand';

export interface Message {
  id: string;
  sender: 'me' | 'other';
  text: string;
}

export interface ChatMessage {
  id: string;
  authorName: string;
  lastMessage: string;
  avatarUrl: string;
  messages: Message[];
}

interface ChatState {
  chats: ChatMessage[];
  myAvatarUrl: string;
}

export const useChatStore = create<ChatState>(() => ({
  myAvatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=150', // Твоя аватарка справа
  chats: [
    {
      id: '1',
      authorName: 'James',
      lastMessage: 'Thank you! That was very helpful!',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150',
      messages: [
        {
          id: 'm1',
          sender: 'other',
          text: 'Really love your most recent photo. I’ve been trying to capture the same thing for a few months and would love some tips!',
        },
        {
          id: 'm2',
          sender: 'me',
          text: 'A fast 50mm like f1.8 would help with the bokeh. I’ve been using primes as they tend to get a bit sharper images.',
        },
        {
          id: 'm3',
          sender: 'other',
          text: 'Thank you! That was very helpful!',
        },
      ],
    },
    {
      id: '2',
      authorName: 'Will Kenny',
      lastMessage: 'I know... I’m trying to get the funds.',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150',
      messages: [
        {
          id: 'c2_m1',
          sender: 'me',
          text: 'Have you thought about upgrading to the new mirrorless system? It is a game changer for street photography.',
        },
        {
          id: 'c2_m2',
          sender: 'other',
          text: 'I know... I’m trying to get the funds.',
        },
      ],
    },
    {
      id: '3',
      authorName: 'Beth Williams',
      lastMessage: 'I’m looking for tips around capturing the milky way. I have a 6D with a 24-100mm...',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150',
      messages: [
        {
          id: 'c3_m1',
          sender: 'other',
          text: 'Hey! I saw your recent astrophotography shots, they are absolutely stunning!',
        },
        {
          id: 'c3_m2',
          sender: 'me',
          text: 'Thank you Beth! It takes a lot of patience, but totally worth it. Let me know if you need any advice.',
        },
        {
          id: 'c3_m3',
          sender: 'other',
          text: 'I’m looking for tips around capturing the milky way. I have a 6D with a 24-100mm...',
        },
      ],
    },
    {
      id: '4',
      authorName: 'Rev Shawn',
      lastMessage: 'Wanted to ask if you’re available for a portrait shoot next week.',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150',
      messages: [
        {
          id: 'c4_m1',
          sender: 'other',
          text: 'Hi there! Your portfolio is amazing.',
        },
        {
          id: 'c4_m2',
          sender: 'me',
          text: 'Hello Shawn! Thanks so much for reaching out, I appreciate it.',
        },
        {
          id: 'c4_m3',
          sender: 'other',
          text: 'Wanted to ask if you’re available for a portrait shoot next week.',
        },
      ],
    },
  ],
}));