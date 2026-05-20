import { useRef, useCallback } from 'react';
import { useSearchStore } from '../../../store/useSearchStore';
import { SearchPhoto } from '../../../store/useSearchStore';

export type { SearchPhoto };

export interface UseSearchFilterReturn {
  query: string;
  displayedPhotos: SearchPhoto[];
  loading: boolean;
  isSearching: boolean;
  hasResults: boolean;
  hasMore: boolean;
  handleChangeText: (text: string) => void;
  loadMore: () => void;
}

export function useSearchFilter(): UseSearchFilterReturn {
  const {
    query,
    displayedPhotos,
    allPhotos,
    loading,
    setQuery,
    runSearch,
    loadMore,
  } = useSearchStore();

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleChangeText = useCallback(
    (text: string) => {
      setQuery(text);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (!text.trim()) {
        runSearch('');
        return;
      }
      debounceRef.current = setTimeout(() => runSearch(text), 400);
    },
    [setQuery, runSearch]
  );

  return {
    query,
    displayedPhotos,
    loading,
    isSearching: query.trim().length > 0,
    hasResults: displayedPhotos.length > 0,
    hasMore: displayedPhotos.length < allPhotos.length,
    handleChangeText,
    loadMore,
  };
}
