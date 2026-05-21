import React from 'react';
import { View, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { useChatStore } from '../../src/store/useChatStore';
import CustomText from '../../src/components/ui/CustomText';
import ChatListItem from '../../src/features/chats/components/ChatListItem';

interface AIChatItem {
    id: string;
    authorName: string;
    lastMessage: string;
    avatarUrl: string;
    isAI: boolean;
    agentId: 'general-ai' | 'photo-coach';
}

export default function ChatsScreen() {
    const { chats } = useChatStore();
    const router = useRouter();

    const aiAgents: AIChatItem[] = [
        {
            id: 'ai-assistant-shortcut',
            authorName: 'AI Assistant 🔮',
            lastMessage: 'Ask me anything in real-time...',
            avatarUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=150',
            isAI: true,
            agentId: 'general-ai'
        },
        {
            id: 'photo-coach-shortcut',
            authorName: 'Photo Coach 📸',
            lastMessage: 'Get tips about composition and lighting...',
            avatarUrl: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=150',
            isAI: true,
            agentId: 'photo-coach'
        }
    ];

    const combinedChats = [...aiAgents, ...chats];

    return (
        <View className="flex-1 bg-white">
            <View className="pt-16 pb-4 border-b border-zinc-200 bg-white justify-center items-center">
                <CustomText className="text-black text-lg font-bold tracking-tight">
                    Chats
                </CustomText>
            </View>

            <FlatList
                data={combinedChats}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => {
                    const isAIElement = 'isAI' in item && item.isAI;

                    return (
                        <ChatListItem
                            authorName={item.authorName}
                            lastMessage={item.lastMessage}
                            avatarUrl={item.avatarUrl}
                            onPress={() => {
                                if (isAIElement) {
                                    router.push({
                                        pathname: '/ai-chat',
                                        params: { agentId: item.agentId, title: item.authorName }
                                    });
                                } else {
                                    router.push(`/chat/${item.id}`);
                                }
                            }}
                        />
                    );
                }}
            />
        </View>
    );
}