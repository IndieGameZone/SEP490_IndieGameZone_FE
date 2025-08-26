import { toSearchParams } from "../object";
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

export interface ReviewData {
  rating: number;
  comment: string;
}

export const createReview = async (userId: string, gameId: string, reviewData: ReviewData) => {
  try {
    const { data } = await axiosClient.post(`/api/users/${userId}/games/${gameId}/reviews`, reviewData);
    return { error: null, data: data, success: true };
  } catch (error) {
    return handleApiError(error);
  }
};

export type GetReviewsParams = {
  Rating?: number;
  PageNumber?: number;
  PageSize?: number;
}

export const getReviewsByGameId = async (gameId: string, params?: GetReviewsParams) => {
  try {
    const { data, headers } = await axiosClient.get(`/api/games/${gameId}/reviews${params ? toSearchParams(params) : ""}`);

    return { error: null, data: { reviews: data, headers }, success: true };
  } catch (error) {
    return handleApiError(error);
  }
};

export const getSummaryReview = async (gameId: string) => {
  try {
    const { data } = await axiosClient.get(`/api/games/${gameId}/reviews-summary`);
    return { error: null, data: data, success: true };
  } catch (error) {
    return handleApiError(error);
  }
};

export const getReviewStatistic = async (gameId: string) => {
  try {
    const { data } = await axiosClient.get(`/api/games/${gameId}/reviews-statistic`);
    return { error: null, data: data, success: true };
  } catch (error) {
    return handleApiError(error);
  }
};

export const getReviewByUserId = async (userId: string) => {
  try {
    const { data } = await axiosClient.get(`/api/users/${userId}/reviews`);
    return { error: null, data: data, success: true };
  } catch (error) {
    return handleApiError(error);
  }
};

export const getExistingReview = async (userId: string, gameId: string) => {
  try {
    const { data } = await axiosClient.get(`/api/users/${userId}/games/${gameId}/reviews`);
    return { error: null, data: data, success: true };
  } catch (error) {
    return handleApiError(error);
  }
};