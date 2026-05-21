import React, { useState, useEffect, useCallback } from 'react';
import { View, ScrollView, Text, RefreshControl, ActivityIndicator } from 'react-native';
import { usePostStore } from '../../src/store/usePostStore';
import { Post } from '../../src/store/usePostStore';
import CustomText from '../../src/components/ui/CustomText';
import Button from '../../src/components/ui/Button';
import BannerSlider from '../../src/features/discover/components/BannerSlider';
import DiscoverMasonryGrid from '../../src/features/discover/components/DiscoverMasonryGrid';
import FullScreenPhotoModal from '../../src/components/shared/FullScreenPhotoModal';

export default function DiscoverScreen() {
  const { featuredPosts, browsePosts, loadMorePosts, fetchPosts, isLoading, hasMore } = usePostStore();
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchPosts();
    setRefreshing(false);
  }, [fetchPosts]);

  return (
    <View className="flex-1 bg-white">
      <ScrollView
        className="flex-1 bg-white"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#000" />
        }
      >
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

          {isLoading && browsePosts.length === 0 ? (
            <View className="py-20 justify-center items-center">
              <ActivityIndicator size="large" color="#000" />
            </View>
          ) : (
            <DiscoverMasonryGrid posts={browsePosts} onPostPress={setSelectedPost} />
          )}

          {hasMore && (
            <View className="mt-4 mb-8">
              <Button
                title={isLoading ? "Loading..." : "See more"}
                variant="outline"
                disabled={isLoading}
                onPress={loadMorePosts}
              />
            </View>
          )}

          {!hasMore && browsePosts.length > 0 && (
            <Text className="text-zinc-400 text-xs text-center my-6 italic tracking-wide">
              You've reached the end of the feed
            </Text>
          )}

        </View>
      </ScrollView>

      <FullScreenPhotoModal post={selectedPost} onClose={() => setSelectedPost(null)} />
    </View>
  );
}