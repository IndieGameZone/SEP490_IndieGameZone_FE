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
export const getAllAccounts = async () => {
    try {
        const { data } = await axiosClient.get(`/api/users`);
        return { error: null, data: data, success: true };
    } catch (error) {
        return handleApiError(error);
    }
};

export const getUserById = async (id: string) => {
  try {
    const { data } = await axiosClient.get(`/api/users/${id}`);
    return { error: null, data, success: true };
  } catch (error) {
    return handleApiError(error);
  }
};

type UpdateUserRequest = {
  fullName: string;
  avatar?: string;
  bio?: string;
  birthday: string;
  facebookLink?: string;
  bankName?: string;
  bankAccount?: string;
}

export const updateUser = async (userId: string, request: UpdateUserRequest) => {
  try {
    const { data } = await axiosClient.put(`/api/users/${userId}`, request);
    return { error: null, data, success: true };
  } catch (error) {
    return handleApiError(error);
  }
};