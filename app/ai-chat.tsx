import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, FlatList, KeyboardAvoidingView, Platform, TouchableOpacity, ActivityIndicator, Keyboard } from 'react-native';
import { useAIChatStore, AIMessage, AIAgentId } from '../src/store/useAIChatStore';
import { auth } from '../src/config/firebase';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function AIChatScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const insets = useSafeAreaInsets();

    const agentId = (params.agentId as AIAgentId) || 'general-ai';
    const chatTitle = (params.title as string) || 'AI Chat';

    const { aiMessages, listenToAiMessages, sendAiMessage, isLoading, isAiTyping, streamingMessage } = useAIChatStore();
    const [inputText, setInputText] = useState('');
    const flatListRef = useRef<FlatList>(null);
    const [keyboardHeight, setKeyboardHeight] = useState(0);
    const scrollOffsetRef = useRef(0);

    useEffect(() => {
        const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
        const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';
        
        const showSubscription = Keyboard.addListener(showEvent, (e) => {
            setKeyboardHeight(e.endCoordinates.height);
            if (scrollOffsetRef.current < 100) {
                setTimeout(() => {
                    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
                }, 100);
            }
        });
        const hideSubscription = Keyboard.addListener(hideEvent, () => {
            setKeyboardHeight(0);
        });
        
        return () => {
            showSubscription.remove();
            hideSubscription.remove();
        };
    }, []);

    useEffect(() => {
        const unsubscribe = listenToAiMessages(agentId);
        return () => unsubscribe();
    }, [agentId, listenToAiMessages]);

    const handleSend = async () => {
        if (!inputText.trim()) return;
        const textToSend = inputText;
        setInputText('');

        flatListRef.current?.scrollToOffset({ offset: 0, animated: true });

        await sendAiMessage(agentId, textToSend);
    };

    const renderItem = ({ item }: { item: AIMessage }) => {
        const isMe = item.senderId === auth.currentUser?.uid && item.senderId !== 'gpt';
        const isStreaming = item.id === 'ai-streaming-temp';

        return (
            <View className={`flex-row ${isMe ? 'justify-end' : 'justify-start'} mb-4`}>
                <View className={`max-w-[75%] ${isMe ? 'items-end' : 'items-start'}`}>
                    {!isMe && <Text className="text-zinc-400 text-[10px] mb-1 ml-1">{item.senderName}</Text>}
                    <View className={`px-4 py-3 rounded-2xl ${isMe ? 'bg-black rounded-tr-none' : 'bg-zinc-100 rounded-tl-none border border-zinc-200'}`}>
                        <Text className={`${isMe ? 'text-white' : 'text-black'} text-sm`}>
                            {item.text}
                            {isStreaming && (
                                <Text className="text-purple-500 font-extrabold ml-0.5">▊</Text>
                            )}
                        </Text>
                    </View>
                </View>
            </View>
        );
    };

    const isKeyboardOpen = keyboardHeight > 0;

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
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
                        data={[...aiMessages].reverse()}
                        inverted
                        keyExtractor={(item) => item.id}
                        renderItem={renderItem}
                        onScroll={(e) => {
                            scrollOffsetRef.current = e.nativeEvent.contentOffset.y;
                        }}
                        scrollEventThrottle={16}
                        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 10, paddingBottom: 20 }}
                        ListHeaderComponent={
                            isAiTyping ? (
                                <View className="flex-row justify-start pl-0 mb-3 items-center">
                                    <View className="bg-zinc-50 px-4 py-2 rounded-full border border-zinc-100 flex-row items-center">
                                        <ActivityIndicator size="small" color="#71717a" className="mr-2" />
                                        <Text className="text-zinc-400 text-xs italic">{chatTitle} is thinking...</Text>
                                    </View>
                                </View>
                            ) : null
                        }
                    />
                </View>
            )}

            <View
                style={{ paddingBottom: isKeyboardOpen ? 20 : (insets.bottom > 0 ? insets.bottom : 12) }}
                className="px-4 pt-3 border-t border-zinc-100 bg-white flex-row items-center"
            >
                <TextInput
                    className="flex-1 h-12 bg-zinc-50 border border-zinc-200 rounded-full px-5 text-black text-sm"
                    placeholder={isAiTyping || streamingMessage ? "AI is replying..." : `Message ${chatTitle}...`}
                    placeholderTextColor="#a1a1aa"
                    value={inputText}
                    onChangeText={setInputText}
                    editable={!isAiTyping && !streamingMessage}
                />
                <TouchableOpacity
                    onPress={handleSend}
                    disabled={!inputText.trim() || isAiTyping || !!streamingMessage}
                    className={`ml-3 w-12 h-12 rounded-full items-center justify-center ${(inputText.trim() && !isAiTyping && !streamingMessage) ? 'bg-black' : 'bg-zinc-100'
                        }`}
                >
                    <Text className={`text-xs font-black uppercase ${(inputText.trim() && !isAiTyping && !streamingMessage) ? 'text-white' : 'text-zinc-400'
                        }`}>Send</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}