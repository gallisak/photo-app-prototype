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
  handlePublish: (onSuccess: () => void) => void;
}

export function useCreatePost(): UseCreatePostReturn {
  const { addPost } = usePostStore();
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [tagsString, setTagsString] = useState('');

  const pickImage = useCallback(async () => {
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
  }, []);

  const handlePublish = useCallback(
    (onSuccess: () => void) => {
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
        { text: 'OK', onPress: onSuccess }
      ]);
    },
    [imageUri, tagsString, addPost]
  );

  return { imageUri, tagsString, setTagsString, setImageUri, pickImage, handlePublish };
}
