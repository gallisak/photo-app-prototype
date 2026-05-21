import { create } from 'zustand';
import { collection, addDoc, getDocs, query, orderBy, serverTimestamp } from 'firebase/firestore';
import * as FileSystem from 'expo-file-system/legacy';
import { db, auth } from '../config/firebase';

export interface Post {
  id: string;
  imageUrl: string;
  authorName?: string;
  authorUsername?: string;
  authorAvatar?: string;
  height?: number;
  tags?: string[];
  createdAt?: any;
  userId?: string;
}

interface PostState {
  featuredPost: Post;
  featuredPosts: Post[];
  browsePosts: Post[];
  isUploading: boolean;
  isLoading: boolean;
  loadMorePosts: () => void;
  fetchPosts: () => Promise<void>;
  addPost: (imageUri: string, tags: string[]) => Promise<void>;
}

const INITIAL_POSTS: Post[] = [
  {
    id: '1',
    imageUrl: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=400',
    height: 220,
    authorName: 'Pawel Czerwinski',
    authorUsername: '@pawel_czerwinski',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150',
    tags: ['abstract', 'art', 'paint']
  },
  {
    id: '2',
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=400',
    height: 160,
    authorName: 'Ridhwan Nordin',
    authorUsername: '@ridznordin',
    authorAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=150',
    tags: ['abstract', 'neon', 'purple']
  },
  {
    id: '3',
    imageUrl: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=400',
    height: 260,
    authorName: 'Angelo Pantazis',
    authorUsername: '@angelopantazis',
    authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150',
    tags: ['dogs', 'dog', 'puppy', 'animal']
  }
];

const ADDITIONAL_POSTS: Post[] = [
  { id: '9', imageUrl: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?q=80&w=400', height: 210, tags: ['nature', 'camping'] },
];

export const usePostStore = create<PostState>((set) => ({
  featuredPost: {
    id: 'featured',
    imageUrl: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?q=80&w=600',
    authorName: 'Ridhwan Nordin',
    authorUsername: '@ridznordin',
    authorAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=150',
  },
  featuredPosts: [
    {
      id: 'featured-1',
      imageUrl: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?q=80&w=600',
      authorName: 'Ridhwan Nordin',
      authorUsername: '@ridznordin',
      authorAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=150',
    }
  ],
  browsePosts: INITIAL_POSTS,
  isUploading: false,
  isLoading: false,

  loadMorePosts: () => set((state) => {
    const hasMore = !state.browsePosts.some(post => post.id === '9');

    if (hasMore) {
      return { browsePosts: [...state.browsePosts, ...ADDITIONAL_POSTS] };
    }

    const endlessPosts = ADDITIONAL_POSTS.map(post => ({
      ...post,
      id: `${post.id}-${Date.now()}-${Math.random()}`
    }));

    return { browsePosts: [...state.browsePosts, ...endlessPosts] };
  }),

  fetchPosts: async () => {
    set({ isLoading: true });
    try {
      const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);

      const loadedPosts: Post[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        loadedPosts.push({
          id: doc.id,
          imageUrl: data.imageUrl,
          tags: data.tags || [],
          height: data.height || 200,
          userId: data.userId,
          authorName: data.authorName,
          authorUsername: data.authorUsername,
          authorAvatar: data.authorAvatar,
          createdAt: data.createdAt,
        });
      });

      set({
        browsePosts: loadedPosts.length > 0 ? loadedPosts : INITIAL_POSTS,
        isLoading: false
      });
    } catch (error) {
      console.error('Error fetching posts:', error);
      set({ isLoading: false });
    }
  },

  addPost: async (imageUri, tags) => {
    set({ isUploading: true });

    try {
      let finalImageUrl = imageUri;

      if (imageUri.startsWith('file://') || imageUri.startsWith('content://')) {
        const base64Data = await FileSystem.readAsStringAsync(imageUri, {
          encoding: FileSystem.EncodingType.Base64,
        });
        finalImageUrl = `data:image/jpeg;base64,${base64Data}`;
      }

      const randomHeight = Math.floor(Math.random() * (260 - 160 + 1)) + 160;

      const newPostData = {
        imageUrl: finalImageUrl,
        tags: tags,
        height: randomHeight,
        userId: auth.currentUser?.uid || 'anonymous',
        authorName: auth.currentUser?.displayName || 'User',
        authorUsername: auth.currentUser?.email?.split('@')[0] || 'user',
        authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150',
        createdAt: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, 'posts'), newPostData);

      const clientPost: Post = {
        id: docRef.id,
        ...newPostData,
        createdAt: new Date(),
      };

      set((state) => ({
        browsePosts: [clientPost, ...state.browsePosts],
        isUploading: false,
      }));

    } catch (error) {
      set({ isUploading: false });
      console.error('Error in addPost (Base64/Firestore):', error);
      throw error;
    }
  }
}));