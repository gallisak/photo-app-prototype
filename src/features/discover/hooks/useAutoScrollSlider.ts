import { useRef, useState, useEffect, useCallback } from 'react';
import { FlatList, ViewToken } from 'react-native';
import { Post } from '../../../types';

interface UseAutoScrollSliderReturn {
  flatListRef: React.RefObject<FlatList<Post>>;
  currentIndex: number;
  onViewableItemsChanged: (info: { viewableItems: ViewToken[] }) => void;
  viewabilityConfig: { itemVisiblePercentThreshold: number };
}

export function useAutoScrollSlider(
  posts: Post[],
  intervalMs: number = 5000
): UseAutoScrollSliderReturn {
  const flatListRef = useRef<FlatList<Post>>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentIndexRef = useRef(0);

  useEffect(() => {
    if (posts.length === 0) return;

    const timer = setInterval(() => {
      const nextIndex = (currentIndexRef.current + 1) % posts.length;
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
      currentIndexRef.current = nextIndex;
      setCurrentIndex(nextIndex);
    }, intervalMs);

    return () => clearInterval(timer);
  }, [posts.length, intervalMs]);

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index !== null) {
        const idx = viewableItems[0].index ?? 0;
        currentIndexRef.current = idx;
        setCurrentIndex(idx);
      }
    },
    []
  );

  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 50 }).current;

  return { flatListRef, currentIndex, onViewableItemsChanged, viewabilityConfig };
}
