import React from 'react';
import { View, Image, TouchableOpacity, Dimensions } from 'react-native';
import { SearchPhoto } from '../../../store/useSearchStore';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const GRID_GAP = 2;
const CELL_SIZE = (SCREEN_WIDTH - 32 - GRID_GAP * 2) / 3;

interface SearchPhotoGridProps {
  photos: SearchPhoto[];
  onPhotoPress: (photo: SearchPhoto) => void;
}

export default function SearchPhotoGrid({ photos, onPhotoPress }: SearchPhotoGridProps) {
  const columns: SearchPhoto[][] = [[], [], []];
  photos.forEach((photo, i) => {
    columns[i % 3].push(photo);
  });

  return (
    <View className="flex-row" style={{ gap: GRID_GAP }}>
      {columns.map((col, colIdx) => (
        <View key={colIdx} className="flex-1" style={{ gap: GRID_GAP }}>
          {col.map((photo) => (
            <TouchableOpacity
              key={photo.id}
              activeOpacity={0.9}
              onPress={() => onPhotoPress(photo)}
            >
              <Image
                source={{ uri: photo.uri }}
                className="w-full bg-zinc-100"
                style={{ height: CELL_SIZE }}
                resizeMode="cover"
              />
            </TouchableOpacity>
          ))}
        </View>
      ))}
    </View>
  );
}
