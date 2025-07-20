import { axiosClient } from './config/axios-client';

export interface ApiResponse {
  error: string | null;
  data: any;
  success: boolean;
}
export const handleApiError = (error: any): ApiResponse => {
  try {
    const errorMessage = error.response?.data.message || error?.message || 'An unexpected error occurred.';
    return { error: errorMessage, data: null, success: false };
  } catch (err) {
    return { error: 'An unexpected error occurred.', data: null, success: false };
  }
};
export const getAllTags = async () => {
    try {
        const { data } = await axiosClient.get(`/api/Tags`);
        return { error: null, data: data, success: true };
    } catch (error) {
        return handleApiError(error);
    }
};

export const createTag = async (tagData: { name: string,type:string }) => {
    try {
        const { data } = await axiosClient.post('/api/tags', tagData);
        return { error: null, data: data, success: true };
    } catch (error) {
        return handleApiError(error);
    }
};

export const updateTag = async (tagId: string | number, tagData: { name: string }) => {
    try {
        const { data } = await axiosClient.put(`/api/tags/${tagId}`, tagData);
        return { error: null, data: data, success: true };
    } catch (error) {
        return handleApiError(error);
    }
};

export const deleteTag = async (tagId: string | number) => {
    try {
        const { data } = await axiosClient.delete(`/api/tags/${tagId}`);
        return { error: null, data: data, success: true };
    } catch (error) {
        return handleApiError(error);
    }
};

export const getTagById = async (tagId: string | number) => {
    try {
        const { data } = await axiosClient.get(`/api/tags/${tagId}`);
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
export const getAllGameTags = async () => {
  try {
    const { data } = await axiosClient.get(`/api/tags`, {
      params: {
        TagType: "Game",
      },
    });
    return { error: null, data: data, success: true };
  } catch (error) {
    return handleApiError(error);
  }
};
