import { create } from 'zustand';
import {
  SEARCH_PHOTO_BANK,
  SEARCH_FALLBACK_PHOTOS,
  SEARCH_PAGE_SIZE,
} from '../constants/searchPhotos';

export interface SearchPhoto {
  id: string;
  uri: string;
}

interface SearchState {
  query: string;
  allPhotos: SearchPhoto[];
  displayedPhotos: SearchPhoto[];
  loading: boolean;

  setQuery: (query: string) => void;
  runSearch: (query: string) => void;
  loadMore: () => void;
  reset: () => void;
}

function buildPhotos(query: string): SearchPhoto[] {
  const lower = query.toLowerCase().trim();

  let urls: string[] = SEARCH_FALLBACK_PHOTOS;
  for (const key of Object.keys(SEARCH_PHOTO_BANK)) {
    if (lower.includes(key)) {
      urls = SEARCH_PHOTO_BANK[key];
      break;
    }
  }

  const seed = lower.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const shuffled = [...urls].sort((a, b) => {
    const ai = (a.charCodeAt(seed % a.length) + seed) % 100;
    const bi = (b.charCodeAt(seed % b.length) + seed) % 100;
    return ai - bi;
  });

  return shuffled.map((uri, i) => ({
    id: `${lower}-${i}-${uri.slice(-8)}`,
    uri,
  }));
}

export const useSearchStore = create<SearchState>((set, get) => ({
  query: '',
  allPhotos: [],
  displayedPhotos: [],
  loading: false,

  setQuery: (query) => set({ query }),

  runSearch: (query) => {
    if (!query.trim()) {
      set({ allPhotos: [], displayedPhotos: [], loading: false });
      return;
    }

    set({ loading: true });

    setTimeout(() => {
      const photos = buildPhotos(query);
      set({
        allPhotos: photos,
        displayedPhotos: photos.slice(0, SEARCH_PAGE_SIZE),
        loading: false,
      });
    }, 350);
  },

  loadMore: () => {
    const { allPhotos, displayedPhotos } = get();
    const nextCount = displayedPhotos.length + SEARCH_PAGE_SIZE;
    set({ displayedPhotos: allPhotos.slice(0, nextCount) });
  },

  reset: () =>
    set({ query: '', allPhotos: [], displayedPhotos: [], loading: false }),
}));
