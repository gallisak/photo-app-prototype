import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useChatDetails } from '../../src/features/chats/hooks/useChatDetails';
import ChatHeader from '../../src/features/chats/components/ChatHeader';
import MessageBubble from '../../src/features/chats/components/MessageBubble';

export default function ChatDetailScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const { chat, myAvatarUrl } = useChatDetails(id as string);

    if (!chat) {
        return (
            <View className="flex-1 bg-white justify-center items-center">
                <Text className="text-zinc-500">Chat not found</Text>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-white">
            <ChatHeader authorName={chat.authorName} onBack={() => router.back()} />

            <FlatList
                data={chat.messages}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 24, paddingBottom: 40 }}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                    <MessageBubble
                        message={item}
                        otherAvatarUrl={chat.avatarUrl}
                        myAvatarUrl={myAvatarUrl}
                    />
                )}
            />
        </View>
    );
}