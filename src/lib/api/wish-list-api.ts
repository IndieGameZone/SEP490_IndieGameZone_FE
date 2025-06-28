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

export const addWishList = async (wishlistData: { userId: string; gameId: string }) => {
  try {
    const { userId, gameId } = wishlistData;
    const { data } = await axiosClient.post(`/api/users/${userId}/games/${gameId}/wishlists`, wishlistData);
    return { error: null, data: data, success: true };
  } catch (error) {
    return handleApiError(error);
  }
};
export const getUserWishlists = async (userId: string) => {
  try {
    const { data } = await axiosClient.get(`/api/users/${userId}/wishlists`);
    return { error: null, data: data, success: true };
  } catch (error) {
    return handleApiError(error);
  }
};

export const removeWishlist = async (userId: string, gameId: string) => {
  try {
    const { data } = await axiosClient.delete(`/api/users/${userId}/games/${gameId}/wishlists`, {
      data: { userId, gameId },
    });
    return { error: null, data: data, success: true };
  } catch (error) {
    return handleApiError(error);
  }
};
