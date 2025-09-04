import { toSearchParams } from "../object";
import { axiosClient } from "./config/axios-client";

export interface ApiResponse {
  error: string | null;
  data: any;
  success: boolean;
  headers?: any;
}

export const handleApiError = (error: any): ApiResponse => {
  try {
    const errorMessage = error.response?.data.message || error?.message || "An unexpected error occurred.";
    return { error: errorMessage, data: null, success: false };
  } catch (err) {
    return { error: "An unexpected error occurred.", data: null, success: false };
  }
};

export const getOrderByUserId = async (userId: string) => {
  try {
    const { data } = await axiosClient.get(`/api/users/${userId}/orders`);
    return { error: null, data: data, success: true };
  } catch (error) {
    return handleApiError(error);
  }
};

export const getOrderById = async (orderId: string) => {
  try {
    const { data } = await axiosClient.get(`/api/orders/${orderId}`);
    return { error: null, data: data, success: true };
  } catch (error) {
    return handleApiError(error);
  }
};

export const resetGameKey = async (userId: string, gameId: string) => {
  try {
    const { data } = await axiosClient.put(`/api/users/${userId}/games/${gameId}/activation-keys/reset`);
    return { error: null, data: data, success: true };
  } catch (error) {
    return handleApiError(error);
  }
};

export type GetAllOrdersParams = {
  PageNumber?: number;
  PageSize?: number;
}

export const getAllOrders = async (params?: GetAllOrdersParams) => {
  try {
    const { data, headers } = await axiosClient.get(`/api/orders${params ? toSearchParams(params) : ""}`);
    return { error: null, data: data, success: true, headers: headers };
  } catch (error) {
    return handleApiError(error);
  }
};