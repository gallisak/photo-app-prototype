import React from 'react';
import { View, Text, FlatList, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useChatStore } from '../../store/useChatStore';
import CustomText from '../../components/CustomText';

export default function ChatsScreen() {
    const { chats } = useChatStore();
    const router = useRouter();

    return (
        <View className="flex-1 bg-white">
            {/* ХЕДЕР */}
            <View className="pt-16 pb-4 border-b border-zinc-200 bg-white justify-center items-center">
                <CustomText className="text-black text-lg font-bold tracking-tight">
                    Chats
                </CustomText>
            </View>

            {/* СПИСОК */}
            <FlatList
                data={chats}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        activeOpacity={0.7}
                        className="flex-row items-center px-4 py-4 border-b border-zinc-100"
                        onPress={() => router.push(`/chat/${item.id}`)} // Перехід на динамічний роут чату
                    >
                        <Image
                            source={{ uri: item.avatarUrl }}
                            className="w-16 h-16 rounded-full bg-zinc-100"
                        />

                        <View className="flex-1 ml-4 justify-center">
                            <Text className="text-black font-bold text-base mb-1">
                                {item.authorName}
                            </Text>
                            <Text
                                className="text-zinc-500 text-sm leading-tight"
                                numberOfLines={2}
                            >
                                {item.lastMessage}
                            </Text>
                        </View>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
}