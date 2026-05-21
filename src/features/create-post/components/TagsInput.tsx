import React from 'react';
import { View, Text, TextInput } from 'react-native';

interface TagsInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onFocus?: () => void;
}

export default function TagsInput({ value, onChangeText, onFocus }: TagsInputProps) {
  return (
    <View className="w-full mb-10">
      <Text className="text-black font-black text-xs uppercase tracking-widest mb-3">
        Tags (separated by comma)
      </Text>
      <View
        className="w-full h-14 px-4 flex-row items-center"
        style={{ borderWidth: 1, borderColor: '#000000' }}
      >
        <TextInput
          className="flex-1 h-full text-black font-medium text-base"
          placeholder="e.g. dogs, winter, nature"
          placeholderTextColor="#a1a1aa"
          value={value}
          onChangeText={onChangeText}
          autoCapitalize="none"
          style={{ paddingVertical: 0 }}
          onFocus={onFocus}
        />
      </View>
    </View>
  );
}