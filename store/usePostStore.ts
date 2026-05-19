import { create } from 'zustand';

export interface Post {
  id: string;
  imageUrl: string;
  authorName?: string;
  authorUsername?: string;
  authorAvatar?: string;
  height?: number;
}

interface PostState {
  featuredPost: Post;
  browsePosts: Post[];
  loadMorePosts: () => void;
}

const INITIAL_POSTS: Post[] = [
  { id: '1', imageUrl: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=400', height: 220 },
  { id: '2', imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=400', height: 160 },
  { id: '3', imageUrl: 'https://images.unsplash.com/photo-1482862549707-f63cb32c5fd9?q=80&w=400', height: 260 },
  { id: '4', imageUrl: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=400', height: 200 },
  { id: '5', imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=400', height: 180 },
  { id: '6', imageUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=400', height: 240 },
  { id: '7', imageUrl: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?q=80&w=400', height: 230 },
  { id: '8', imageUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=400', height: 170 },
];

const ADDITIONAL_POSTS: Post[] = [
  { id: '9', imageUrl: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?q=80&w=400', height: 210 },
  { id: '10', imageUrl: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?q=80&w=400', height: 250 },
  { id: '11', imageUrl: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?q=80&w=400', height: 160 },

];

export const usePostStore = create<PostState>((set) => ({
  featuredPost: {
    id: 'featured',
    imageUrl: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?q=80&w=600',
    authorName: 'Ridhwan Nordin',
    authorUsername: '@ridznordin',
    authorAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=150',
  },
  browsePosts: INITIAL_POSTS,

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
  })
}));