import React from 'react';
import { View, Text, Image } from 'react-native';

interface Message {
  id: string;
  sender: 'me' | 'other';
  text: string;
}

interface MessageBubbleProps {
  message: Message;
  otherAvatarUrl: string;
  myAvatarUrl: string;
}

export default function MessageBubble({
  message,
  otherAvatarUrl,
  myAvatarUrl,
}: MessageBubbleProps) {
  const isMe = message.sender === 'me';

  return (
    <View className={`flex-row items-end mb-6 ${isMe ? 'justify-end' : 'justify-start'}`}>

      {!isMe && (
        <Image
          source={{ uri: otherAvatarUrl }}
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
          {message.text}
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
}
