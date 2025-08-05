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

export const createFollow = async (followerId: string, followeeId: string) => {
  try {
    const { data } = await axiosClient.post(`/api/followers/${followerId}/followees/${followeeId}/user-follows`);
    return { error: null, data: data, success: true };
  } catch (error) {
    return handleApiError(error);
  }
};

export const getNumberofFollowees = async (followeeId: string) => {
  try {
    const { data } = await axiosClient.get(`/api/followees/${followeeId}/number-of-followers`);
    return { error: null, data: data, success: true };
  } catch (error) {
    return handleApiError(error);
  }
};
export const getNumberofFollowers = async (followerId: string) => {
  try {
    const { data } = await axiosClient.get(`/api/followers/${followerId}/number-of-followees`);
    return { error: null, data: data, success: true };
  } catch (error) {
    return handleApiError(error);
  }
};
export const checkIfFollowed = async (followerId: string, followeeId: string) => {
  try {
    const { data } = await axiosClient.get(`/api/followers/${followerId}/followees/${followeeId}/user-follows`);
    return { error: null, data: data, success: true };
  } catch (error) {
    return handleApiError(error);
  }
};
