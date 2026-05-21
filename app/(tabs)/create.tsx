import React, { useRef, useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, Keyboard, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import CustomText from '../../src/components/ui/CustomText';
import Button from '../../src/components/ui/Button';
import ImageUploadZone from '../../src/features/create-post/components/ImageUploadZone';
import TagsInput from '../../src/features/create-post/components/TagsInput';
import { useCreatePost } from '../../src/features/create-post/hooks/useCreatePost';

export default function CreatePostScreen() {
    const router = useRouter();
    const scrollViewRef = useRef<ScrollView>(null);
    const [keyboardHeight, setKeyboardHeight] = useState(0);
    const [tagsInputY, setTagsInputY] = useState(0);

    const { imageUri, tagsString, setTagsString, setImageUri, pickImage, handlePublish, isUploading } =
        useCreatePost();

    useEffect(() => {
        const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
        const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

        const showSubscription = Keyboard.addListener(showEvent, (e) => {
            setKeyboardHeight(e.endCoordinates.height);
        });
        const hideSubscription = Keyboard.addListener(hideEvent, () => {
            setKeyboardHeight(0);
        });

        return () => {
            showSubscription.remove();
            hideSubscription.remove();
        };
    }, []);

    const handleTagsFocus = () => {
        setTimeout(() => {
            if (scrollViewRef.current) {
                scrollViewRef.current.scrollTo({
                    y: Math.max(0, tagsInputY - 300),
                    animated: true,
                });
            }
        }, 100);
    };

    return (
        <ScrollView
            ref={scrollViewRef}
            className="flex-1 bg-white"
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
        >
            <View
                style={{ paddingBottom: keyboardHeight > 0 ? keyboardHeight + 100 : 40 }}
                className="px-4 pt-16"
            >

                <CustomText className="text-black text-4xl font-light tracking-tight mb-8">
                    New Photo
                </CustomText>

                <Text className="text-black font-black text-xs uppercase tracking-widest mb-3">
                    Select Image
                </Text>

                <ImageUploadZone imageUri={imageUri} onPress={isUploading ? () => { } : pickImage} />

                {!imageUri && (
                    <View className="mb-6">
                        <Text className="text-zinc-400 text-xs text-center mb-2">— OR PASTE URL DIRECTLY —</Text>
                        <TextInput
                            editable={!isUploading}
                            className="w-full h-12 border border-zinc-300 px-4 text-black text-sm"
                            placeholder="https://example.com/photo.jpg"
                            placeholderTextColor="#a1a1aa"
                            onChangeText={(text) => text.trim().length > 10 && setImageUri(text.trim())}
                        />
                    </View>
                )}

                <View
                    onLayout={(event) => {
                        setTagsInputY(event.nativeEvent.layout.y);
                    }}
                >
                    <TagsInput value={tagsString} onChangeText={setTagsString} onFocus={handleTagsFocus} />
                </View>

                <Button
                    title={isUploading ? "Publishing..." : "Publish Photo"}
                    disabled={isUploading}
                    onPress={() => handlePublish(() => router.replace('/(tabs)'))}
                />

                <View className="min-h-12" />

            </View>
        </ScrollView>
    );
}