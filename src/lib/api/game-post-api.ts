import { toFormData, toSearchParams } from "../object";
import { axiosClient } from "./config/axios-client";

export const handleApiError = (error: any): { error: string | null; data: any; success: boolean } => {
  try {
    const errorMessage = error.response?.data.message || error?.message || "An unexpected error occurred.";
    const data = null;
    return { error: errorMessage, data, success: false };
  } catch (err) {
    return { error: "An unexpected error occurred.", data: null, success: false };
  }
};

export interface PostData {
  Title: string;
  Content: string;
  Images: string[];
  Tags: string[];
}

export const createPost = async (userId: string, gameId: string, postData: PostData) => {
  try {
    const formData = toFormData(postData);
    const { data } = await axiosClient.post(`/api/users/${userId}/games/${gameId}/posts`, formData);
    return { error: null, data: data, success: true };
  } catch (error) {
    return handleApiError(error);
  }
};

export interface PostCommentData {
  Content: string;
}

export const createPostComment = async (postId: string, userId: string, postCommentData: PostCommentData) => {
  try {
    const formData = toFormData(postCommentData);
    const { data } = await axiosClient.post(`/api/posts/${postId}/users/${userId}/post-comments`, formData);
    return { error: null, data: data, success: true };
  } catch (error) {
    return handleApiError(error);
  }
};

export const createReactionPost = async (userId: string, postId: string) => {
  try {
    const { data } = await axiosClient.post(`/api/users/${userId}/posts/${postId}/post-reactions`);
    return { error: null, data: data, success: true };
  } catch (error) {
    return handleApiError(error);
  }
};

type GetGamePostParams = {
  PageNumber?: number,
  PageSize?: number
}

export const getGamePosts = async (gameId: string, params: GetGamePostParams) => {
  console.log(params);
  try {
    const { data, headers } = await axiosClient.get(`/api/games/${gameId}/posts${toSearchParams(params)}`);
    return {
      error: null, data: { posts: data, headers }, success: true
    };
  } catch (error) {
    return handleApiError(error);
  }
};

export const getReactionPost = async (userId: string, postId: string) => {
  try {
    const { data } = await axiosClient.get(`/ api / users / ${userId} / posts / ${postId} / post - reactions`);
    return { error: null, data: data, success: true };
  } catch (error) {
    return handleApiError(error);
  }
};
export const getAllPostTags = async () => {
  try {
    const { data } = await axiosClient.get(`/api/tags`, {
      params: {
        TagType: "Post",
      },
    });
    return { error: null, data: data, success: true };
  } catch (error) {
    return handleApiError(error);
  }
};
