import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, FlatList, KeyboardAvoidingView, Platform, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useAIChatStore, AIMessage, AIAgentId } from '../src/store/useAIChatStore';
import { auth } from '../src/config/firebase';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function AIChatScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();

    const agentId = (params.agentId as AIAgentId) || 'general-ai';
    const chatTitle = (params.title as string) || 'AI Chat';

    const { aiMessages, listenToAiMessages, sendAiMessage, isLoading, isAiTyping } = useAIChatStore();
    const [inputText, setInputText] = useState('');
    const flatListRef = useRef<FlatList>(null);

    useEffect(() => {
        const unsubscribe = listenToAiMessages(agentId);
        return () => unsubscribe();
    }, [agentId, listenToAiMessages]);

    const handleSend = async () => {
        if (!inputText.trim()) return;
        const textToSend = inputText;
        setInputText('');

        await sendAiMessage(agentId, textToSend);
    };

    const renderItem = ({ item }: { item: AIMessage }) => {
        const isMe = item.senderId === auth.currentUser?.uid && item.senderId !== 'gpt';

        return (
            <View className={`flex-row ${isMe ? 'justify-end' : 'justify-start'} mb-4`}>
                <View className={`max-w-[75%] ${isMe ? 'items-end' : 'items-start'}`}>
                    {!isMe && <Text className="text-zinc-400 text-[10px] mb-1 ml-1">{item.senderName}</Text>}
                    <View className={`px-4 py-3 rounded-2xl ${isMe ? 'bg-black rounded-tr-none' : 'bg-zinc-100 rounded-tl-none border border-zinc-200'}`}>
                        <Text className={`${isMe ? 'text-white' : 'text-black'} text-sm`}>{item.text}</Text>
                    </View>
                </View>
            </View>
        );
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
            className="flex-1 bg-white"
        >
            <View className="px-4 pt-16 pb-4 border-b border-zinc-100 bg-white flex-row items-center">
                <TouchableOpacity onPress={() => router.back()} className="mr-4 p-1">
                    <Text className="text-black text-xl font-bold">←</Text>
                </TouchableOpacity>
                <View>
                    <Text className="text-black text-xl font-bold tracking-tight">{chatTitle}</Text>
                    <Text className="text-zinc-400 text-[10px] uppercase tracking-widest mt-0.5">Active Agent</Text>
                </View>
            </View>

            {isLoading && aiMessages.length === 0 ? (
                <View className="flex-1 justify-center items-center">
                    <ActivityIndicator size="large" color="#000" />
                </View>
            ) : (
                <View className="flex-1">
                    <FlatList
                        ref={flatListRef}
                        data={aiMessages}
                        keyExtractor={(item) => item.id}
                        renderItem={renderItem}
                        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 20, paddingBottom: 10 }}
                        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
                        onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
                    />
                    {isAiTyping && (
                        <View className="flex-row justify-start pl-4 mb-3 items-center">
                            <View className="bg-zinc-50 px-4 py-2 rounded-full border border-zinc-100 flex-row items-center">
                                <ActivityIndicator size="small" color="#71717a" className="mr-2" />
                                <Text className="text-zinc-400 text-xs italic">{chatTitle} is thinking...</Text>
                            </View>
                        </View>
                    )}
                </View>
            )}

            <View className="p-4 border-t border-zinc-100 bg-white flex-row items-center">
                <TextInput
                    className="flex-1 mb-5 h-12 bg-zinc-50 border border-zinc-200 rounded-full px-5 text-black text-sm"
                    placeholder={`Message ${chatTitle}...`}
                    placeholderTextColor="#a1a1aa"
                    value={inputText}
                    onChangeText={setInputText}
                />
                <TouchableOpacity onPress={handleSend} disabled={!inputText.trim()} className={`ml-3 mb-5 w-12 h-12 rounded-full items-center justify-center ${inputText.trim() ? 'bg-black' : 'bg-zinc-100'}`}>
                    <Text className={`text-xs font-black uppercase ${inputText.trim() ? 'text-white' : 'text-zinc-400'}`}>Send</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}