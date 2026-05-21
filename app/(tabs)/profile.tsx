import React, { useState, useEffect } from 'react';
import { View, ScrollView, Image, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useAuthStore } from '../../src/store/useAuthStore';
import { usePostStore, Post } from '../../src/store/usePostStore';
import Button from '../../src/components/ui/Button';
import DiscoverMasonryGrid from '../../src/features/discover/components/DiscoverMasonryGrid';
import FullScreenPhotoModal from '../../src/components/shared/FullScreenPhotoModal';

export default function ProfileScreen() {
    const user = useAuthStore((state) => state.user);
    const logout = useAuthStore((state) => state.logout);

    const { userPosts, fetchUserPosts, isLoading } = usePostStore();
    const [selectedPost, setSelectedPost] = useState<Post | null>(null);

    useEffect(() => {
        fetchUserPosts();
    }, [fetchUserPosts]);

    const userName = user?.displayName || user?.email?.split('@')[0] || 'User';
    const userEmail = user?.email?.toUpperCase() || 'MY ACCOUNT';
    const avatarUrl = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=250';

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

                    <Text className="text-zinc-500 font-bold text-[11px] uppercase tracking-[1.5px] mb-4">
                        {userEmail}
                    </Text>

                    <TouchableOpacity
                        onPress={logout}
                        activeOpacity={0.7}
                        className="mb-8 border border-zinc-200 px-5 py-2 rounded-full"
                    >
                        <Text className="text-red-500 font-bold text-[10px] uppercase tracking-[1px]">
                            Log Out
                        </Text>
                    </TouchableOpacity>

                    {isLoading && userPosts.length === 0 ? (
                        <View className="py-10 justify-center items-center">
                            <ActivityIndicator size="large" color="#000" />
                        </View>
                    ) : userPosts.length === 0 ? (
                        <View className="py-10 items-center">
                            <Text className="text-zinc-400 text-sm italic mb-2">No photos published yet</Text>
                            <Text className="text-zinc-400 text-xs text-center px-10">
                                Go to the Create tab and share your first masterpiece!
                            </Text>
                        </View>
                    ) : (
                        <DiscoverMasonryGrid posts={userPosts} onPostPress={setSelectedPost} />
                    )}

                    {userPosts.length > 6 && (
                        <View className="w-full mt-5 mb-4">
                            <Button
                                title="See more"
                                variant="outline"
                                onPress={() => alert('End of feed')}
                            />
                        </View>
                    )}

                </View>
            </ScrollView>

            <FullScreenPhotoModal post={selectedPost} onClose={() => setSelectedPost(null)} />
        </View>
    );
}