import React from 'react';
import { View, Text, FlatList, Image, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useChatStore } from '../../store/useChatStore';
import { ChevronLeft } from 'lucide-react-native';
import CustomText from '../../components/CustomText';

export default function ChatDetailScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const { chats, myAvatarUrl } = useChatStore();

    const currentChat = chats.find((c) => c.id === id);

    if (!currentChat) {
        return (
            <View className="flex-1 bg-white justify-center items-center">
                <Text className="text-zinc-500">Chat not found</Text>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-white">
            <View className="pt-16 pb-4 border-b border-zinc-200 bg-white flex-row items-center px-4">
                <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 justify-center">
                    <ChevronLeft size={28} color="#000000" />
                </TouchableOpacity>

                <View className="flex-1 items-center pr-10">
                    <CustomText className="text-black text-lg font-bold">
                        {currentChat.authorName}
                    </CustomText>
                </View>
            </View>

            <FlatList
                data={currentChat.messages}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 24, paddingBottom: 40 }}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => {
                    const isMe = item.sender === 'me';

                    return (
                        <View className={`flex-row items-end mb-6 ${isMe ? 'justify-end' : 'justify-start'}`}>

                            {!isMe && (
                                <Image
                                    source={{ uri: currentChat.avatarUrl }}
                                    className="w-9 h-9 rounded-full mr-3 mb-1"
                                />
                            )}

                            <View
                                className={`max-w-[75%] p-4 rounded-xl ${isMe ? 'bg-white border border-zinc-100' : 'bg-zinc-50'
                                    }`}
                                style={isMe ? {
                                    shadowColor: '#000',
                                    shadowOffset: { width: 0, height: 1 },
                                    shadowOpacity: 0.05,
                                    shadowRadius: 2,
                                    elevation: 1,
                                } : {}}
                            >
                                <Text className="text-black text-sm leading-relaxed font-normal">
                                    {item.text}
                                </Text>
                            </View>

                            {isMe && (
                                <Image
                                    source={{ uri: myAvatarUrl }}
                                    className="w-9 h-9 rounded-full ml-3 mb-1"
                                />
                            )}

                        </View>
                    );
                }}
            />
        </View>
    );
}