import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import CustomText from '../../../components/ui/CustomText';

interface ChatHeaderProps {
  authorName: string;
  onBack: () => void;
}

export default function ChatHeader({ authorName, onBack }: ChatHeaderProps) {
  return (
    <View className="pt-16 pb-4 border-b border-zinc-200 bg-white flex-row items-center px-4">
      <TouchableOpacity onPress={onBack} className="w-10 h-10 justify-center">
        <ChevronLeft size={28} color="#000000" />
      </TouchableOpacity>

      <View className="flex-1 items-center pr-10">
        <CustomText className="text-black text-lg font-bold">
          {authorName}
        </CustomText>
      </View>
    </View>
  );
}
