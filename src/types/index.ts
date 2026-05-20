export interface Post {
  id: string;
  imageUrl: string;
  authorName?: string;
  authorUsername?: string;
  authorAvatar?: string;
  height?: number;
  tags?: string[];
}

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

export interface SearchPhoto {
  id: string;
  uri: string;
}
