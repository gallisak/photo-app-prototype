import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { usePostStore } from '../../store/usePostStore';
import CustomText from '../../components/CustomText';
import Button from '../../components/Button';
import { Camera } from 'lucide-react-native';

export default function CreatePostScreen() {
    const router = useRouter();
    const { addPost } = usePostStore();

    const [imageUri, setImageUri] = useState<string | null>(null);
    const [tagsString, setTagsString] = useState('');

    const pickImage = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (permissionResult.granted === false) {
            Alert.alert("Permission Denied", "You need to allow access to your photos to upload them.");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.8,
        });

        if (!result.canceled) {
            setImageUri(result.assets[0].uri);
        }
    };

    const handlePublish = () => {
        if (!imageUri) {
            Alert.alert('Error', 'Please select or provide an image.');
            return;
        }

        const tagsArray = tagsString
            .split(',')
            .map(tag => tag.trim().toLowerCase())
            .filter(tag => tag.length > 0);

        addPost(imageUri, tagsArray);

        setImageUri(null);
        setTagsString('');

        Alert.alert('Success', 'Photo published!', [
            { text: 'OK', onPress: () => router.replace('/(tabs)') }
        ]);
    };

    return (
        <ScrollView className="flex-1 bg-white" showsVerticalScrollIndicator={false}>
            <View className="px-4 pt-16 pb-8">

                <CustomText className="text-black text-4xl font-light tracking-tight mb-8">
                    New Photo
                </CustomText>

                <Text className="text-black font-black text-xs uppercase tracking-widest mb-3">
                    Select Image
                </Text>

                <TouchableOpacity
                    onPress={pickImage}
                    className="w-full h-64 border border-black border-dashed justify-center items-center mb-8 bg-zinc-50"
                >
                    {imageUri ? (
                        <Image source={{ uri: imageUri }} className="w-full h-full" resizeMode="cover" />
                    ) : (
                        <View className="items-center">
                            <Camera size={40} color="#000000" strokeWidth={1.5} />
                            <Text className="text-zinc-500 font-medium text-sm mt-2">Open Device Gallery</Text>
                        </View>
                    )}
                </TouchableOpacity>

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

                <Text className="text-black font-black text-xs uppercase tracking-widest mb-3">
                    Tags (separated by comma)
                </Text>
                <View className="w-full h-14 border border-black px-4 flex-row items-center mb-10">
                    <TextInput
                        className="flex-1 h-full text-black font-medium text-base"
                        placeholder="e.g. dogs, winter, nature"
                        placeholderTextColor="#a1a1aa"
                        value={tagsString}
                        onChangeText={setTagsString}
                        autoCapitalize="none"
                    />
                </View>

                <Button
                    title="Publish Photo"
                    onPress={handlePublish}
                />

            </View>
        </ScrollView>
    );
}