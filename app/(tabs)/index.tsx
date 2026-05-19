import React, { useState, useRef, useEffect } from 'react';
import { View, ScrollView, Image, TouchableOpacity, Text, Modal, Dimensions, FlatList } from 'react-native';
import { usePostStore, Post } from '../../store/usePostStore';
import CustomText from '../../components/CustomText';
import Button from '../../components/Button';
import { X } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH - 32;

export default function DiscoverScreen() {
  const { featuredPosts, browsePosts, loadMorePosts } = usePostStore();

  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      if (featuredPosts && featuredPosts.length > 0) {
        let nextIndex = currentIndex + 1;
        if (nextIndex >= featuredPosts.length) {
          nextIndex = 0;
        }
        flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
        setCurrentIndex(nextIndex);
      }
    }, 5000);

    return () => clearInterval(timer);
  }, [currentIndex, featuredPosts]);

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems && viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index || 0);
    }
  }).current;

  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 50 }).current;

  const leftColumn = browsePosts.filter((_, index) => index % 2 === 0);
  const rightColumn = browsePosts.filter((_, index) => index % 2 !== 0);

  const handleOpenPhoto = (post: Post) => {
    setSelectedPost(post);
  };

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
            <FlatList
              ref={flatListRef}
              data={featuredPosts}
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
                  onPress={() => handleOpenPhoto(item)}
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
          </View>

          <Text className="text-black font-black text-xs uppercase tracking-widest mb-4">
            Browse all
          </Text>

          <View className="flex-row space-x-3 mb-6">
            <View className="flex-1 space-y-3 mr-1.5">
              {leftColumn.map((post) => (
                <TouchableOpacity
                  key={post.id}
                  activeOpacity={0.9}
                  onPress={() => handleOpenPhoto(post)}
                >
                  <Image
                    source={{ uri: post.imageUrl }}
                    style={{ height: post.height }}
                    className="w-full bg-zinc-100"
                    resizeMode="cover"
                  />
                </TouchableOpacity>
              ))}
            </View>

            <View className="flex-1 space-y-3 ml-1.5">
              {rightColumn.map((post) => (
                <TouchableOpacity
                  key={post.id}
                  activeOpacity={0.9}
                  onPress={() => handleOpenPhoto(post)}
                >
                  <Image
                    source={{ uri: post.imageUrl }}
                    style={{ height: post.height }}
                    className="w-full bg-zinc-100"
                    resizeMode="cover"
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View className="mt-4 mb-8">
            <Button
              title="See more"
              variant="outline"
              onPress={loadMorePosts}
            />
          </View>
        </View>
      </ScrollView>

      <Modal
        visible={selectedPost !== null}
        animationType="fade"
        transparent={false}
        onRequestClose={() => setSelectedPost(null)}
      >
        {selectedPost && (
          <View className="flex-1 bg-black justify-between">
            <Image
              source={{ uri: selectedPost.imageUrl }}
              style={{ position: 'absolute', width: '100%', height: '100%' }}
              resizeMode="contain"
            />

            <LinearGradient
              colors={['rgba(0,0,0,0.8)', 'rgba(0,0,0,0)']}
              className="w-full pt-16 px-4 flex-row justify-between items-center pb-8 absolute top-0 z-10"
            >
              <View className="flex-row items-center">
                <Image
                  source={{ uri: selectedPost.authorAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150' }}
                  className="w-10 h-10 rounded-full border border-white/40"
                />
                <View className="ml-3">
                  <Text className="text-white font-bold text-sm leading-tight shadow-sm shadow-black">
                    {selectedPost.authorName || 'Anonymous Author'}
                  </Text>
                  <Text className="text-white/80 text-xs shadow-sm shadow-black">
                    {selectedPost.authorUsername || '@anonymous'}
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                onPress={() => setSelectedPost(null)}
                className="w-10 h-10 justify-center items-end"
              >
                <X size={28} color="#FFFFFF" />
              </TouchableOpacity>
            </LinearGradient>

            <View className="pb-12" />
          </View>
        )}
      </Modal>
    </View>
  );
}