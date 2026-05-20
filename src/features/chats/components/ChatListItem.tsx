import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';

interface ChatListItemProps {
  authorName: string;
  lastMessage: string;
  avatarUrl: string;
  onPress: () => void;
}

export default function ChatListItem({ authorName, lastMessage, avatarUrl, onPress }: ChatListItemProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      className="flex-row items-center px-4 py-4 border-b border-zinc-100"
      onPress={onPress}
    >
      <Image
        source={{ uri: avatarUrl }}
        className="w-16 h-16 rounded-full bg-zinc-100"
      />

      <View className="flex-1 ml-4 justify-center">
        <Text className="text-black font-bold text-base mb-1">
          {authorName}
        </Text>
        <Text
          className="text-zinc-500 text-sm leading-tight"
          numberOfLines={2}
        >
          {lastMessage}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
