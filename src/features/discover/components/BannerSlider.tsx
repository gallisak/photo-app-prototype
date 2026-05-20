import React from 'react';
import { View, Image, TouchableOpacity, Text, Dimensions, FlatList } from 'react-native';
import { Post } from '../../../types';
import { useAutoScrollSlider } from '../hooks/useAutoScrollSlider';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH - 32;

interface BannerSliderProps {
  posts: Post[];
  onPostPress: (post: Post) => void;
}

export default function BannerSlider({ posts, onPostPress }: BannerSliderProps) {
  const { flatListRef, onViewableItemsChanged, viewabilityConfig } =
    useAutoScrollSlider(posts);

  return (
    <FlatList
      ref={flatListRef}
      data={posts}
      keyExtractor={(item) => item.id}
      horizontal
      showsHorizontalScrollIndicator={false}
      snapToInterval={CARD_WIDTH}
      decelerationRate="fast"
      onViewableItemsChanged={onViewableItemsChanged}
      viewabilityConfig={viewabilityConfig}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={{ width: CARD_WIDTH }}
          activeOpacity={0.9}
          onPress={() => onPostPress(item)}
        >
          <Image
            source={{ uri: item.imageUrl }}
            className="w-full h-96 bg-zinc-100"
            resizeMode="cover"
          />
          <View className="flex-row items-center mt-3">
            <Image
              source={{ uri: item.authorAvatar }}
              className="w-8 h-8 rounded-full"
            />
            <View className="ml-3">
              <Text className="text-black font-bold text-sm leading-tight">
                {item.authorName}
              </Text>
              <Text className="text-zinc-400 text-xs">
                {item.authorUsername}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      )}
    />
  );
}
