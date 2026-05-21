import { create } from 'zustand';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../config/firebase';
import { fetch } from 'expo/fetch';

const getTimestampAsMs = (createdAt: any): number => {
    if (!createdAt) return Date.now();
    if (typeof createdAt.toMillis === 'function') {
        return createdAt.toMillis();
    }
    if (createdAt.seconds) {
        return createdAt.seconds * 1000 + Math.floor((createdAt.nanoseconds || 0) / 1000000);
    }
    if (createdAt instanceof Date) {
        return createdAt.getTime();
    }
    if (typeof createdAt === 'number') {
        return createdAt;
    }
    return Date.now();
};

export interface AIMessage {
    id: string;
    text: string;
    senderId: string;
    senderName: string;
    createdAt: number;
}

export type AIAgentId = 'general-ai' | 'photo-coach';

interface AIChatState {
    aiMessages: AIMessage[];
    dbMessages: AIMessage[];
    streamingMessage: AIMessage | null;
    isLoading: boolean;
    isAiTyping: boolean;
    unsubscribeFromMessages: (() => void) | null;
    listenToAiMessages: (agentId: AIAgentId) => () => void;
    sendAiMessage: (agentId: AIAgentId, text: string) => Promise<void>;
}

const OPENROUTER_API_KEY = process.env.EXPO_PUBLIC_CHAT_GBT_API_KEY;

export const useAIChatStore = create<AIChatState>((set, get) => ({
    aiMessages: [],
    dbMessages: [],
    streamingMessage: null,
    isLoading: false,
    isAiTyping: false,
    unsubscribeFromMessages: null,

    listenToAiMessages: (agentId: AIAgentId) => {
        const currentUnsubscribe = get().unsubscribeFromMessages;
        if (currentUnsubscribe) currentUnsubscribe();

        set({ isLoading: true, aiMessages: [], dbMessages: [], streamingMessage: null });

        const userId = auth.currentUser?.uid || 'anonymous';
        const q = query(
            collection(db, 'ai_chats', agentId, 'users', userId, 'messages'),
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
                    createdAt: getTimestampAsMs(data.createdAt),
                });
            });

            const streaming = get().streamingMessage;
            let finalMessages = messages;
            if (streaming) {
                const exists = messages.some(m =>
                    m.id === streaming.id ||
                    (m.senderId === 'gpt' && m.text.trim() === streaming.text.trim())
                );
                if (!exists) {
                    finalMessages = [...messages, streaming];
                }
            }

            set({
                dbMessages: messages,
                aiMessages: finalMessages,
                isLoading: false
            });
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

        const userId = auth.currentUser?.uid || 'anonymous';
        const chatRef = collection(db, 'ai_chats', agentId, 'users', userId, 'messages');
        const timestamp = Date.now();

        try {
            const userMessageForDb = {
                text: text.trim(),
                senderId: userId,
                senderName: auth.currentUser?.displayName || auth.currentUser?.email?.split('@')[0] || 'User',
                createdAt: serverTimestamp(),
            };
            await addDoc(chatRef, userMessageForDb);

            set({ isAiTyping: true });

            const tempUserMessage: AIMessage = {
                id: 'temp',
                text: text.trim(),
                senderId: userId,
                senderName: userMessageForDb.senderName,
                createdAt: timestamp,
            };

            const sortedHistory = [...aiMessages, tempUserMessage]
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
                    'Accept': 'text/event-stream',
                    'Cache-Control': 'no-cache',
                },
                body: JSON.stringify({
                    model: 'openrouter/auto',
                    stream: true,
                    messages: [
                        { role: 'system', content: systemPrompt },
                        ...chatHistory
                    ],
                }),
            });

            if (!response.ok) {
                const errText = await response.text();
                throw new Error(`OpenRouter API Error: ${response.status} - ${errText}`);
            }

            if (!response.body) {
                throw new Error("Response body is not readable (streaming not supported)");
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder('utf-8');
            let accumulatedText = '';
            let displayedText = '';
            let buffer = '';
            let streamFinished = false;
            let typewriterTimer: any = null;

            const finalizeStream = async () => {
                if (accumulatedText.trim()) {
                    try {
                        const gptMessage = {
                            text: accumulatedText.trim(),
                            senderId: 'gpt',
                            senderName: botName,
                            createdAt: serverTimestamp(),
                        };
                        await addDoc(chatRef, gptMessage);
                    } catch (e) {
                        console.error("Failed saving final AI message:", e);
                    }
                }

                set((state) => ({
                    streamingMessage: null,
                    aiMessages: state.dbMessages,
                    isAiTyping: false,
                }));
            };

            const updateTypewriter = () => {
                if (displayedText.length < accumulatedText.length) {
                    const diff = accumulatedText.length - displayedText.length;
                    const charsToAdd = diff > 20 ? Math.ceil(diff / 5) : 1;
                    displayedText += accumulatedText.slice(displayedText.length, displayedText.length + charsToAdd);

                    const newStreaming = {
                        id: 'ai-streaming-temp',
                        text: displayedText,
                        senderId: 'gpt',
                        senderName: botName,
                        createdAt: Date.now(),
                    };

                    set((state) => {
                        const exists = state.dbMessages.some(m =>
                            m.id === newStreaming.id ||
                            (m.senderId === 'gpt' && m.text.trim() === newStreaming.text.trim())
                        );
                        return {
                            streamingMessage: newStreaming,
                            aiMessages: exists ? state.dbMessages : [...state.dbMessages, newStreaming],
                        };
                    });
                }

                if (streamFinished && displayedText.length >= accumulatedText.length) {
                    if (typewriterTimer) {
                        clearInterval(typewriterTimer);
                        typewriterTimer = null;
                    }
                    finalizeStream();
                }
            };

            typewriterTimer = setInterval(updateTypewriter, 16);

            try {
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    const chunkText = decoder.decode(value, { stream: true });
                    buffer += chunkText;

                    const lines = buffer.split('\n');
                    buffer = lines.pop() || '';

                    for (const line of lines) {
                        const cleanedLine = line.trim();
                        if (!cleanedLine) continue;
                        if (cleanedLine === 'data: [DONE]') continue;
                        if (cleanedLine.startsWith('data: ')) {
                            const jsonStr = cleanedLine.slice(6);
                            try {
                                const parsed = JSON.parse(jsonStr);
                                const content = parsed.choices?.[0]?.delta?.content;
                                if (content) {
                                    accumulatedText += content;

                                    if (get().isAiTyping) {
                                        set({ isAiTyping: false });
                                    }
                                }
                            } catch (e) {
                            }
                        }
                    }
                }

                streamFinished = true;
            } catch (e) {
                if (typewriterTimer) {
                    clearInterval(typewriterTimer);
                    typewriterTimer = null;
                }
                throw e;
            }

        } catch (error) {
            console.error("AI Integration Error during stream:", error);
            set({ isAiTyping: false, streamingMessage: null });
        }
    },
}));