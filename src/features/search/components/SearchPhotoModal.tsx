import React from 'react';
import { View, Image, TouchableOpacity, Modal } from 'react-native';
import { X } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SearchPhoto } from '../../../store/useSearchStore';

interface SearchPhotoModalProps {
  photo: SearchPhoto | null;
  onClose: () => void;
}

export default function SearchPhotoModal({ photo, onClose }: SearchPhotoModalProps) {
  return (
    <Modal
      visible={photo !== null}
      animationType="fade"
      transparent={false}
      onRequestClose={onClose}
      statusBarTranslucent={true}
    >
      {photo && (
        <View className="flex-1 bg-black justify-center">
          <Image
            source={{ uri: photo.uri }}
            style={{ position: 'absolute', width: '100%', height: '100%' }}
            resizeMode="contain"
          />
          <LinearGradient
            colors={['rgba(0,0,0,0.7)', 'rgba(0,0,0,0)']}
            className="absolute top-0 left-0 right-0 pt-[60px] px-4 pb-8 flex-row justify-end"
          >
            <TouchableOpacity
              onPress={onClose}
              className="w-10 h-10 justify-center items-end"
            >
              <X size={28} color="#FFFFFF" />
            </TouchableOpacity>
          </LinearGradient>
        </View>
      )}
    </Modal>
  );
}
