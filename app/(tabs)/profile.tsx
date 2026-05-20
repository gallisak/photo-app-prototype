import React, { useState } from 'react';
import { View, ScrollView, Image, TouchableOpacity, Text, Modal } from 'react-native';
import { useAuthStore } from '../../store/useAuthStore';
import { usePostStore, Post } from '../../store/usePostStore';
import Button from '../../components/Button';
import { X } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function ProfileScreen() {
    const user = useAuthStore((state) => state.user);
    const { browsePosts, loadMorePosts } = usePostStore();
    const [selectedPost, setSelectedPost] = useState<Post | null>(null);

    const profilePhotos = [...browsePosts].reverse();
    const leftColumn = profilePhotos.filter((_, index) => index % 2 === 0);
    const rightColumn = profilePhotos.filter((_, index) => index % 2 !== 0);

    const userName = user?.name || 'Jane';
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

                    <View className="w-full flex-row">
                        <View className="flex-1 mr-1.5">
                            {leftColumn.map((post) => (
                                <TouchableOpacity
                                    key={post.id}
                                    activeOpacity={0.9}
                                    onPress={() => setSelectedPost(post)}
                                    className="mb-3"
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

                        <View className="flex-1 ml-1.5">
                            {rightColumn.map((post) => (
                                <TouchableOpacity
                                    key={post.id}
                                    activeOpacity={0.9}
                                    onPress={() => setSelectedPost(post)}
                                    className="mb-3"
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

                    <View className="w-full mt-5 mb-4">
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
                statusBarTranslucent={true}
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
                                    source={{ uri: avatarUrl }}
                                    className="w-10 h-10 rounded-full border border-white/40"
                                />
                                <View className="ml-3">
                                    <Text className="text-white font-bold text-sm leading-tight shadow-sm shadow-black">
                                        {userName}
                                    </Text>
                                    <Text className="text-white/80 text-xs shadow-sm shadow-black">
                                        {location}
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