import { GamePost, PostComment } from '@/types/game-post';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

type PostStore = {
  posts: GamePost[];
  comments: Record<string, PostComment[]>;

  getPosts: () => GamePost[];
  getPostById: (id: string) => GamePost | undefined;
  setPosts: (posts: GamePost[]) => void;
  updatePost: (updated: GamePost) => void;
  updatePostById: (id: string, updatedFields: Partial<GamePost>) => void;
  deletePost: (id: string) => void;
  toggleLikePost: (id: string) => void;
  setLikePost: (id: string, value: boolean) => void;

  getComments: (postId: string) => PostComment[];
  setComments: (postId: string, comments: PostComment[]) => void;
  addComment: (postId: string, comment: PostComment) => void;
  updateComment: (postId: string, commentId: string, updatedFields: Partial<PostComment>) => void;
  deleteComment: (postId: string, commentId: string) => void;
};

const usePostStore = create<PostStore>()(
  immer((set, get) => ({
    posts: [],
    comments: {},

    getPosts: () => get().posts,
    getPostById: (id) => get().posts.find((post) => post.id === id),
    setPosts: (posts) => set((state) => { state.posts = posts }),

    updatePost: (updated) =>
      set((state: PostStore) => {
        const index = state.posts.findIndex((post) => post.id === updated.id);
        if (index !== -1) {
          state.posts[index] = updated;
        }
      }),

    updatePostById: (id, updatedFields) =>
      set((state: PostStore) => {
        const post = state.posts.find((p) => p.id === id);
        if (post) {
          Object.assign(post, updatedFields);
        }
      }),

    deletePost: (id) =>
      set((state: PostStore) => {
        state.posts = state.posts.filter((post) => post.id !== id);
        delete state.comments[id];
      }),

    toggleLikePost: (id) =>
      set((state: PostStore) => {
        const post = state.posts.find((p) => p.id === id);
        if (post) {
          post.numberOfLikes += post.liked ? -1 : 1;
          post.liked = !post.liked;
        }
      }),

    setLikePost: (id, value) =>
      set((state: PostStore) => {
        const post = state.posts.find((p) => p.id === id);
        if (post) {
          post.liked = value;
        }
      }),

    getComments: (postId) => get().comments[postId] || [],
    setComments: (postId, comments) =>
      set((state) => {
        state.comments[postId] = comments;
      }),

    addComment: (postId, comment) =>
      set((state: PostStore) => {
        if (!state.comments[postId]) {
          state.comments[postId] = [];
        }
        state.comments[postId].push(comment);

        const post = state.posts.find((p) => p.id === postId);
        if (post) post.numberOfComments += 1;
      }),

    updateComment: (postId, commentId, updatedFields) =>
      set((state: PostStore) => {
        const comments = state.comments[postId];
        if (comments) {
          const comment = comments.find((c) => c.id === commentId);
          if (comment) {
            Object.assign(comment, updatedFields);
          }
        }
      }),

    deleteComment: (postId, commentId) =>
      set((state: PostStore) => {
        const comments = state.comments[postId];
        if (comments) {
          state.comments[postId] = comments.filter((c) => c.id !== commentId);
        }

        const post = state.posts.find((p) => p.id === postId);
        if (post) post.numberOfComments -= 1;
      }),
  }))
);

export default usePostStore;