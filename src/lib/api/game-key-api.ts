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

export const createDevKeyByGameID = async (gameId: string) => {
  try {
    const { data } = await axiosClient.post(`/api/games/${gameId}/activation-keys-dev`);
    return { error: null, data: data, success: true };
  } catch (error) {
    return handleApiError(error);
  }
};
export const createModeratorKeyByGameID = async (gameId: string) => {
  try {
    const { data } = await axiosClient.post(`/api/games/${gameId}/activation-keys-moderator`);
    return { error: null, data: data, success: true };
  } catch (error) {
    return handleApiError(error);
  }
};
