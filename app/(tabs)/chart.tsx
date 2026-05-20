import React from 'react';
import { View, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { useChatStore } from '../../src/store/useChatStore';
import CustomText from '../../src/components/ui/CustomText';
import ChatListItem from '../../src/features/chats/components/ChatListItem';

export default function ChatsScreen() {
    const { chats } = useChatStore();
    const router = useRouter();

    return (
        <View className="flex-1 bg-white">
            <View className="pt-16 pb-4 border-b border-zinc-200 bg-white justify-center items-center">
                <CustomText className="text-black text-lg font-bold tracking-tight">
                    Chats
                </CustomText>
            </View>

            <FlatList
                data={chats}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                    <ChatListItem
                        authorName={item.authorName}
                        lastMessage={item.lastMessage}
                        avatarUrl={item.avatarUrl}
                        onPress={() => router.push(`/chat/${item.id}`)}
                    />
                )}
            />
        </View>
    );
}