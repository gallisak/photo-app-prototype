import { create } from 'zustand';
import { collection, addDoc, getDocs, query, orderBy, where, limit, startAfter, serverTimestamp } from 'firebase/firestore';
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
  userPosts: Post[];
  lastVisibleDoc: any;
  hasMore: boolean;
  isUploading: boolean;
  isLoading: boolean;
  loadMorePosts: () => Promise<void>;
  fetchPosts: () => Promise<void>;
  fetchUserPosts: () => Promise<void>;
  addPost: (imageUri: string, tags: string[]) => Promise<void>;
}

const POSTS_LIMIT = 4;

const INITIAL_POSTS: Post[] = [
  {
    id: '1',
    imageUrl: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=400',
    height: 220,
    authorName: 'Pawel Czerwinski',
    authorUsername: '@pawel_czerwinski',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150',
    tags: ['abstract', 'art', 'paint']
  }
];

export const usePostStore = create<PostState>((set, get) => ({
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
  browsePosts: [],
  userPosts: [],
  lastVisibleDoc: null,
  hasMore: true,
  isUploading: false,
  isLoading: false,

  fetchPosts: async () => {
    set({ isLoading: true, hasMore: true, lastVisibleDoc: null });
    try {
      const q = query(
        collection(db, 'posts'),
        orderBy('createdAt', 'desc'),
        limit(POSTS_LIMIT)
      );

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

      const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1] || null;

      set({
        browsePosts: loadedPosts.length > 0 ? loadedPosts : INITIAL_POSTS,
        lastVisibleDoc: lastVisible,
        hasMore: loadedPosts.length === POSTS_LIMIT,
        isLoading: false
      });
    } catch (error) {
      console.error('Error fetching posts:', error);
      set({ browsePosts: INITIAL_POSTS, isLoading: false, hasMore: false });
    }
  },

  loadMorePosts: async () => {
    const { lastVisibleDoc, browsePosts, isLoading, hasMore } = get();

    if (isLoading || !hasMore || !lastVisibleDoc) return;

    set({ isLoading: true });
    try {
      const nextQ = query(
        collection(db, 'posts'),
        orderBy('createdAt', 'desc'),
        startAfter(lastVisibleDoc),
        limit(POSTS_LIMIT)
      );

      const querySnapshot = await getDocs(nextQ);
      const nextPosts: Post[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        nextPosts.push({
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

      const nextLastVisible = querySnapshot.docs[querySnapshot.docs.length - 1] || null;

      set({
        browsePosts: [...browsePosts, ...nextPosts],
        lastVisibleDoc: nextLastVisible,
        hasMore: nextPosts.length === POSTS_LIMIT,
        isLoading: false
      });
    } catch (error) {
      console.error('Error loading more posts:', error);
      set({ isLoading: false });
    }
  },

  fetchUserPosts: async () => {
    const currentUid = auth.currentUser?.uid;
    if (!currentUid) return;

    set({ isLoading: true });
    try {
      const q = query(
        collection(db, 'posts'),
        where('userId', '==', currentUid),
        orderBy('createdAt', 'desc')
      );

      const querySnapshot = await getDocs(q);
      const myPosts: Post[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        myPosts.push({
          id: doc.id,
          imageUrl: data.imageUrl,
          tags: data.tags || [],
          height: data.height || 220,
          userId: data.userId,
          authorName: data.authorName,
          authorUsername: data.authorUsername,
          authorAvatar: data.authorAvatar,
          createdAt: data.createdAt,
        });
      });

      set({ userPosts: myPosts, isLoading: false });
    } catch (error) {
      console.error('Error fetching user posts:', error);
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
        userPosts: [clientPost, ...state.userPosts],
        isUploading: false,
      }));

    } catch (error) {
      set({ isUploading: false });
      console.error('Error in addPost (Base64/Firestore):', error);
      throw error;
    }
  }
}));