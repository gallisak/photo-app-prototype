import React from 'react';
import { View, Text, TextInput, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import CustomText from '../../src/components/ui/CustomText';
import Button from '../../src/components/ui/Button';
import ImageUploadZone from '../../src/features/create-post/components/ImageUploadZone';
import TagsInput from '../../src/features/create-post/components/TagsInput';
import { useCreatePost } from '../../src/features/create-post/hooks/useCreatePost';

export default function CreatePostScreen() {
    const router = useRouter();
    const { imageUri, tagsString, setTagsString, setImageUri, pickImage, handlePublish } =
        useCreatePost();

    return (
        <ScrollView className="flex-1 bg-white" showsVerticalScrollIndicator={false}>
            <View className="px-4 pt-16 pb-8">

                <CustomText className="text-black text-4xl font-light tracking-tight mb-8">
                    New Photo
                </CustomText>

                <Text className="text-black font-black text-xs uppercase tracking-widest mb-3">
                    Select Image
                </Text>

                <ImageUploadZone imageUri={imageUri} onPress={pickImage} />

                {!imageUri && (
                    <View className="mb-6">
                        <Text className="text-zinc-400 text-xs text-center mb-2">— OR PASTE URL DIRECTLY —</Text>
                        <TextInput
                            className="w-full h-12 border border-zinc-300 px-4 text-black text-sm"
                            placeholder="https://example.com/photo.jpg"
                            placeholderTextColor="#a1a1aa"
                            onChangeText={(text) => text.trim().length > 10 && setImageUri(text.trim())}
                        />
                    </View>
                )}

                <TagsInput value={tagsString} onChangeText={setTagsString} />

                <Button
                    title="Publish Photo"
                    onPress={() => handlePublish(() => router.replace('/(tabs)'))}
                />

            </View>
        </ScrollView>
    );
}