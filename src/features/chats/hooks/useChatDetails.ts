import { useChatStore } from '../../../store/useChatStore';
import { ChatMessage } from '../../../store/useChatStore';

interface UseChatDetailsReturn {
  chat: ChatMessage | undefined;
  myAvatarUrl: string;
}

export function useChatDetails(id: string): UseChatDetailsReturn {
  const { chats, myAvatarUrl } = useChatStore();
  const chat = chats.find((c) => c.id === id);
  return { chat, myAvatarUrl };
}
