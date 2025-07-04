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

export const createFollow= async (playerId: string,developerId: string) => {
  try {
    const { data } = await axiosClient.post(`/api/players/${playerId}/developerId${developerId}/user-follows`);
    return { error: null, data: data, success: true };
  } catch (error) {
    return handleApiError(error);
  }
};
export const getReviewByGameId = async (gameId: string) => {
  try {
    const { data } = await axiosClient.get(`/api/games/${gameId}/reviews`);
    return { error: null, data: data, success: true };
  } catch (error) {
    return handleApiError(error);
  }
};
