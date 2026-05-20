import React, { useState } from 'react';
import { View, ScrollView, Image, TouchableOpacity, Text } from 'react-native';
import { useAuthStore } from '../../src/store/useAuthStore';
import { usePostStore, Post } from '../../src/store/usePostStore';
import Button from '../../src/components/ui/Button';
import DiscoverMasonryGrid from '../../src/features/discover/components/DiscoverMasonryGrid';
import FullScreenPhotoModal from '../../src/components/shared/FullScreenPhotoModal';

export default function ProfileScreen() {
    const user = useAuthStore((state) => state.user);
    const { browsePosts, loadMorePosts } = usePostStore();
    const [selectedPost, setSelectedPost] = useState<Post | null>(null);

    const profilePhotos = [...browsePosts].reverse();

    const userName = user?.displayName || 'Jane';
    const avatarUrl = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=250';
    const location = 'SAN FRANCISCO, CA';

    return (
        <View className="flex-1 bg-white">
            <ScrollView
                className="flex-1 bg-white"
                showsVerticalScrollIndicator={false}
            >
                <View className="px-4 pt-20 pb-8 items-center">

                    <Image
                        source={{ uri: avatarUrl }}
                        className="w-[120px] h-[120px] rounded-full mb-6"
                        resizeMode="cover"
                    />

                    <Text className="text-black text-[38px] font-light tracking-tight mb-3">
                        {userName}
                    </Text>

                    <Text className="text-black font-black text-[11px] uppercase tracking-[1.5px] mb-8">
                        {location}
                    </Text>

                    <DiscoverMasonryGrid posts={profilePhotos} onPostPress={setSelectedPost} />

                    <View className="w-full mt-5 mb-4">
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