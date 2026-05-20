import React from 'react';
import { View, Image, TouchableOpacity, Text, Modal } from 'react-native';
import { X } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Post } from '../../types';

interface FullScreenPhotoModalProps {
  post: Post | null;
  onClose: () => void;
}

export default function FullScreenPhotoModal({ post, onClose }: FullScreenPhotoModalProps) {
  return (
    <Modal
      visible={post !== null}
      animationType="fade"
      transparent={false}
      onRequestClose={onClose}
      statusBarTranslucent={true}
    >
      {post && (
        <View className="flex-1 bg-black justify-between">
          <Image
            source={{ uri: post.imageUrl }}
            style={{ position: 'absolute', width: '100%', height: '100%' }}
            resizeMode="contain"
          />

          <LinearGradient
            colors={['rgba(0,0,0,0.8)', 'rgba(0,0,0,0)']}
            className="w-full pt-16 px-4 flex-row justify-between items-center pb-8 absolute top-0 z-10"
          >
            <View className="flex-row items-center">
              <Image
                source={{ uri: post.authorAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150' }}
                className="w-10 h-10 rounded-full border border-white/40"
              />
              <View className="ml-3">
                <Text className="text-white font-bold text-sm leading-tight shadow-sm shadow-black">
                  {post.authorName || 'Anonymous Author'}
                </Text>
                <Text className="text-white/80 text-xs shadow-sm shadow-black">
                  {post.authorUsername || '@anonymous'}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={onClose}
              className="w-10 h-10 justify-center items-end"
            >
              <X size={28} color="#FFFFFF" />
            </TouchableOpacity>
          </LinearGradient>

          <View className="pb-12" />
        </View>
      )}
    </Modal>
  );
}
