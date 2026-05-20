import React from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import { Post } from '../../../types';

interface DiscoverMasonryGridProps {
  posts: Post[];
  onPostPress: (post: Post) => void;
}

export default function DiscoverMasonryGrid({ posts, onPostPress }: DiscoverMasonryGridProps) {
  const leftColumn = posts.filter((_, index) => index % 2 === 0);
  const rightColumn = posts.filter((_, index) => index % 2 !== 0);

  return (
    <View className="flex-row space-x-3 mb-6">
      <View className="flex-1 space-y-3 mr-1.5">
        {leftColumn.map((post) => (
          <TouchableOpacity
            key={post.id}
            activeOpacity={0.9}
            onPress={() => onPostPress(post)}
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
            onPress={() => onPostPress(post)}
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
  );
}
