import React from 'react';
import { View, TextInput } from 'react-native';

interface SearchInputProps {
  value: string;
  onChangeText: (text: string) => void;
  isSearching: boolean;
}

export default function SearchInput({ value, onChangeText, isSearching }: SearchInputProps) {
  return (
    <View
      className={`border-[1.5px] border-black px-3.5 py-3 ${isSearching ? 'mb-5' : 'mb-0'}`}
    >
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder="Search all photos"
        placeholderTextColor="#9ca3af"
        className="text-base text-black p-0 m-0"
        autoCorrect={false}
        autoCapitalize="none"
        returnKeyType="search"
      />
    </View>
  );
}
