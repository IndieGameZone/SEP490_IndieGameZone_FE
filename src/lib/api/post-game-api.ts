import { toFormData } from "../object";
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

export const getGamePosts = async (gameId: string) => {
  try {
    const { data } = await axiosClient.get(`/api/games/${gameId}/posts`);
    return { error: null, data: data, success: true };
  } catch (error) {
    return handleApiError(error);
  }
};

