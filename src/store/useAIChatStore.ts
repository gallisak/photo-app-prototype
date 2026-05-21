import { create } from 'zustand';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../config/firebase';

export interface AIMessage {
    id: string;
    text: string;
    senderId: string;
    senderName: string;
    createdAt: any;
}

export type AIAgentId = 'general-ai' | 'photo-coach';

interface AIChatState {
    aiMessages: AIMessage[];
    isLoading: boolean;
    isAiTyping: boolean;
    unsubscribeFromMessages: (() => void) | null;
    listenToAiMessages: (agentId: AIAgentId) => () => void;
    sendAiMessage: (agentId: AIAgentId, text: string) => Promise<void>;
}

const OPENROUTER_API_KEY = process.env.EXPO_PUBLIC_CHAT_GBT_API_KEY;

export const useAIChatStore = create<AIChatState>((set, get) => ({
    aiMessages: [],
    isLoading: false,
    isAiTyping: false,
    unsubscribeFromMessages: null,

    listenToAiMessages: (agentId: AIAgentId) => {
        const currentUnsubscribe = get().unsubscribeFromMessages;
        if (currentUnsubscribe) currentUnsubscribe();

        set({ isLoading: true, aiMessages: [] });

        const q = query(
            collection(db, 'ai_chats', agentId, 'messages'),
            orderBy('createdAt', 'asc')
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const messages: AIMessage[] = [];
            snapshot.forEach((doc) => {
                const data = doc.data();
                messages.push({
                    id: doc.id,
                    text: data.text,
                    senderId: data.senderId,
                    senderName: data.senderName,
                    createdAt: data.createdAt,
                });
            });
            set({ aiMessages: messages, isLoading: false });
        }, (error) => {
            console.error(`AI Chat (${agentId}) real-time error:`, error);
            set({ isLoading: false });
        });

        set({ unsubscribeFromMessages: unsubscribe });
        return unsubscribe;
    },

    sendAiMessage: async (agentId: AIAgentId, text: string) => {
        if (!text.trim()) return;

        const { aiMessages } = get();

        let systemPrompt = 'You are a helpful AI Assistant integrated into a mobile application. Keep answers very brief and conversational.';
        let botName = 'AI Assistant';

        if (agentId === 'photo-coach') {
            systemPrompt = 'You are a professional photography coach. Give very short, actionable tips about lighting, composition, and camera settings.';
            botName = 'Photo Coach';
        }

        try {
            const chatRef = collection(db, 'ai_chats', agentId, 'messages');

            const timestamp = Date.now();

            const userMessage = {
                text: text.trim(),
                senderId: auth.currentUser?.uid || 'anonymous',
                senderName: auth.currentUser?.displayName || auth.currentUser?.email?.split('@')[0] || 'User',
                createdAt: timestamp,
            };
            await addDoc(chatRef, userMessage);

            set({ isAiTyping: true });

            const sortedHistory = [...aiMessages, { ...userMessage, id: 'temp' }]
                .sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));

            const chatHistory = sortedHistory.slice(-6).map((msg) => ({
                role: msg.senderId === 'gpt' ? 'assistant' : 'user',
                content: msg.text,
            }));

            const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
                    'HTTP-Referer': 'http://localhost:19006',
                    'X-Title': 'Photo App AI',
                },
                body: JSON.stringify({
                    model: 'openrouter/auto',
                    messages: [
                        { role: 'system', content: systemPrompt },
                        ...chatHistory
                    ],
                }),
            });

            if (!response.ok) throw new Error('OpenRouter API Error');

            const data = await response.json();
            const aiReplyText = data.choices[0].message.content;

            const gptMessage = {
                text: aiReplyText.trim(),
                senderId: 'gpt',
                senderName: botName,
                createdAt: Date.now(),
            };
            await addDoc(chatRef, gptMessage);

            set({ isAiTyping: false });

        } catch (error) {
            console.error("AI integration error:", error);
            set({ isAiTyping: false });
        }
    },
}));