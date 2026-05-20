import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Camera } from 'lucide-react-native';

interface ImageUploadZoneProps {
  imageUri: string | null;
  onPress: () => void;
}

export default function ImageUploadZone({ imageUri, onPress }: ImageUploadZoneProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.9}
      className="w-full h-64 justify-center items-center bg-zinc-50 mb-8"
      style={{
        borderWidth: 1,
        borderColor: '#000000',
        borderStyle: 'dashed',
      }}
    >
      {imageUri ? (
        <Image
          source={{ uri: imageUri }}
          className="w-full h-full"
          resizeMode="cover"
        />
      ) : (
        <View className="items-center justify-center flex-1 w-full">
          <Camera size={40} color="#000000" strokeWidth={1.5} />
          <Text className="text-zinc-500 font-medium text-sm mt-2 text-center">
            Open Device Gallery
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}