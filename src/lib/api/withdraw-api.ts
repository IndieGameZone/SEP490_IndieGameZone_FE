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
export const getWithdrawRequestById = async (userId: string) => {
  try {
    const { data } = await axiosClient.get(`/api/users/${userId}/withdraw-requests/`);
    return { error: null, data: data, success: true };
  } catch (error) {
    return handleApiError(error);
  }
};
export interface withdrawRequestData {
  amount: number;
}

export const createWithdrawRequest = async (userId: string, withdrawData: withdrawRequestData) => {
  try {
    const { data } = await axiosClient.post(`/api/users/${userId}/withdraw-requests`, withdrawData);
    return { error: null, data: data, success: true };
  } catch (error) {
    return handleApiError(error);
  }
};
export const getAllWithdrawRequests = async () => {
  try {
    const { data } = await axiosClient.get(`/api/withdraw-requests`);
    return { error: null, data: data, success: true };
  } catch (error) {
    return handleApiError(error);
  }
};
export const updateWithdrawRequestStatus = async (withdrawId: string, ImageProof: string, status: string, RejectReason?: string) => {
  try {
    const { data } = await axiosClient.put(`/api/withdraw-requests/${withdrawId}`, { ImageProof, status, RejectReason });
    return { error: null, data: data, success: true };
  } catch (error) {
    return handleApiError(error);
  }
};