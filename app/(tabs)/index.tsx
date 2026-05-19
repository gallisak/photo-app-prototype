import { View, ScrollView, Image, TouchableOpacity, Text } from 'react-native';
import { usePostStore } from '../../store/usePostStore';
import CustomText from '../../components/CustomText';
import Button from '../../components/Button';

export default function DiscoverScreen() {
  const { featuredPost, browsePosts, loadMorePosts } = usePostStore();

  const leftColumn = browsePosts.filter((_, index) => index % 2 === 0);
  const rightColumn = browsePosts.filter((_, index) => index % 2 !== 0);

  return (
    <ScrollView className="flex-1 bg-white" showsVerticalScrollIndicator={false}>
      <View className="px-4 pt-16 pb-8">

        <CustomText className="text-black text-4xl font-light tracking-tight mb-8">
          Discover
        </CustomText>

        <Text className="text-black font-black text-xs uppercase tracking-widest mb-4">
          What's new today
        </Text>

        <View className="mb-10">
          <Image
            source={{ uri: featuredPost.imageUrl }}
            className="w-full h-96 bg-zinc-100"
            resizeMode="cover"
          />
          <View className="flex-row items-center mt-3">
            <Image
              source={{ uri: featuredPost.authorAvatar }}
              className="w-8 h-8 rounded-full"
            />
            <View className="ml-3">
              <Text className="text-black font-bold text-sm leading-tight">
                {featuredPost.authorName}
              </Text>
              <Text className="text-zinc-400 text-xs">
                {featuredPost.authorUsername}
              </Text>
            </View>
          </View>
        </View>

        <Text className="text-black font-black text-xs uppercase tracking-widest mb-4">
          Browse all
        </Text>

        <View className="flex-row space-x-3 mb-6">

          <View className="flex-1 space-y-3 mr-1.5">
            {leftColumn.map((post) => (
              <TouchableOpacity key={post.id} activeOpacity={0.9}>
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
              <TouchableOpacity key={post.id} activeOpacity={0.9}>
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
  );
}