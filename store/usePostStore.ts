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
  featuredPosts: Post[];
  browsePosts: Post[];
  loadMorePosts: () => void;
}

const INITIAL_POSTS: Post[] = [
  { 
    id: '1', 
    imageUrl: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=400', 
    height: 220,
    authorName: 'Pawel Czerwinski',
    authorUsername: '@pawel_czerwinski',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150'
  },
  { 
    id: '2', 
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=400', 
    height: 160,
    authorName: 'Ridhwan Nordin',
    authorUsername: '@ridznordin',
    authorAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=150'
  },
  { 
    id: '3', 
    imageUrl: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=400',
    height: 260,
    authorName: 'Angelo Pantazis',
    authorUsername: '@angelopantazis',
    authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150'
  },
  { 
    id: '4', 
    imageUrl: 'https://images.unsplash.com/photo-1482862549707-f63cb32c5fd9?q=80&w=400', 
    height: 200,
    authorName: 'Sean Oulashin',
    authorUsername: '@seany',
    authorAvatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=150'
  },
  { 
    id: '5', 
    imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=400', 
    height: 180,
    authorName: 'John Doe',
    authorUsername: '@johndoe',
    authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150'
  },
  { 
    id: '6', 
    imageUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=400', 
    height: 240,
    authorName: 'Jane Smith',
    authorUsername: '@janesmith',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150'
  }
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
  featuredPosts: [
    {
      id: 'featured-1',
      imageUrl: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?q=80&w=600',
      authorName: 'Ridhwan Nordin',
      authorUsername: '@ridznordin',
      authorAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=150',
    },
    {
      id: 'featured-2',
      imageUrl: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?q=80&w=600',
      authorName: 'Clem Onojeghuo',
      authorUsername: '@clemono2',
      authorAvatar: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?q=80&w=150',
    },
    {
      id: 'featured-3',
      imageUrl: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=600',
      authorName: 'Jon Tyson',
      authorUsername: '@jontyson',
      authorAvatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=150',
    },
    {
      id: 'featured-4',
      imageUrl: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?q=80&w=600',
      authorName: 'Simon Zhu',
      authorUsername: '@smnzhu',
      authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150',
    }
  ],
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