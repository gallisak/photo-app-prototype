import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { usePostStore } from '../../../store/usePostStore';

interface UseCreatePostReturn {
  imageUri: string | null;
  tagsString: string;
  setTagsString: (v: string) => void;
  setImageUri: (uri: string | null) => void;
  pickImage: () => Promise<void>;
  handlePublish: (onSuccess: () => void) => Promise<void>;
  isUploading: boolean;
}

export function useCreatePost(): UseCreatePostReturn {
  const addPost = usePostStore((state) => state.addPost);
  const isUploading = usePostStore((state) => state.isUploading);

  const [imageUri, setImageUri] = useState<string | null>(null);
  const [tagsString, setTagsString] = useState('');

  const pickImage = useCallback(async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert("Permission Denied", "You need to allow access to your photos to upload them.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.3,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  }, []);

  const handlePublish = useCallback(
    async (onSuccess: () => void) => {
      if (!imageUri) {
        Alert.alert('Error', 'Please select or provide an image.');
        return;
      }

      const tagsArray = tagsString
        .split(',')
        .map(tag => tag.trim().toLowerCase())
        .filter(tag => tag.length > 0);

      try {
        await addPost(imageUri, tagsArray);

        setImageUri(null);
        setTagsString('');

        Alert.alert('Success', 'Photo published successfully!', [
          { text: 'OK', onPress: onSuccess }
        ]);
      } catch (error) {
        console.error("Publish handle error:", error);
        Alert.alert('Upload Failed', 'Failed to publish post. Image might be too large.');
      }
    },
    [imageUri, tagsString, addPost]
  );

  return {
    imageUri,
    tagsString,
    setTagsString,
    setImageUri,
    pickImage,
    handlePublish,
    isUploading
  };
}