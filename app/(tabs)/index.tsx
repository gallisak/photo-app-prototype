import React, { useState } from 'react';
import { View, ScrollView, Text } from 'react-native';
import { usePostStore } from '../../src/store/usePostStore';
import { Post } from '../../src/store/usePostStore';
import CustomText from '../../src/components/ui/CustomText';
import Button from '../../src/components/ui/Button';
import BannerSlider from '../../src/features/discover/components/BannerSlider';
import DiscoverMasonryGrid from '../../src/features/discover/components/DiscoverMasonryGrid';
import FullScreenPhotoModal from '../../src/components/shared/FullScreenPhotoModal';

export default function DiscoverScreen() {
  const { featuredPosts, browsePosts, loadMorePosts } = usePostStore();
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  return (
    <View className="flex-1 bg-white">
      <ScrollView className="flex-1 bg-white" showsVerticalScrollIndicator={false}>
        <View className="px-4 pt-16 pb-8">

          <CustomText className="text-black text-4xl font-light tracking-tight mb-8">
            Discover
          </CustomText>

          <Text className="text-black font-black text-xs uppercase tracking-widest mb-4">
            What's new today
          </Text>

          <View className="mb-10">
            <BannerSlider posts={featuredPosts} onPostPress={setSelectedPost} />
          </View>

          <Text className="text-black font-black text-xs uppercase tracking-widest mb-4">
            Browse all
          </Text>

          <DiscoverMasonryGrid posts={browsePosts} onPostPress={setSelectedPost} />

          <View className="mt-4 mb-8">
            <Button
              title="See more"
              variant="outline"
              onPress={loadMorePosts}
            />
          </View>
        </View>
      </ScrollView>

      <FullScreenPhotoModal post={selectedPost} onClose={() => setSelectedPost(null)} />
    </View>
  );
}