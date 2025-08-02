import { axiosClient } from "./config/axios-client";

export interface ApiResponse {
  error: string | null;
  data: any;
  success: boolean;
}
export const handleApiError = (error: any): ApiResponse => {
  try {
    const errorMessage = error.response?.data.message || error?.message || "An unexpected error occurred.";
    return { error: errorMessage, data: null, success: false };
  } catch (err) {
    return { error: "An unexpected error occurred.", data: null, success: false };
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
  youtubeChannelLink?: string;
};

export const updateUser = async (userId: string, request: UpdateUserRequest) => {
  const formData = new FormData();
  formData.append("Fullname", request.fullName);
  if (request.avatar) formData.append("Avatar", request.avatar);
  if (request.bio) formData.append("Bio", request.bio);
  formData.append("Birthday", request.birthday);
  if (request.facebookLink) formData.append("FacebookLink", request.facebookLink);
  if (request.youtubeChannelLink) formData.append("YoutubeChannelLink", request.youtubeChannelLink);
  try {
    const { data } = await axiosClient.put(`/api/users/${userId}`, request, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return { error: null, data, success: true };
  } catch (error) {
    return handleApiError(error);
  }
};

export const getAllBanHistories = async () => {
  try {
    const { data } = await axiosClient.get(`/api/ban-histories`);
    return { error: null, data: data, success: true };
  } catch (error) {
    return handleApiError(error);
  }
};

export const getBanHistoryById = async (userId: string) => {
  try {
    const { data } = await axiosClient.get(`/api/ban-histories/${userId}`);
    return { error: null, data, success: true };
  } catch (error) {
    return handleApiError(error);
  }
};
type CreateBanHistoryRequest = {
  unbanDate?: string;
  reason: string;
  bannedUserId: string;
  bannedByUserId: string;
};

export const createBanHistory = async (request: CreateBanHistoryRequest) => {
  try {
    const { data } = await axiosClient.post(`/api/ban-histories`, request, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return { error: null, data, success: true };
  } catch (error) {
    return handleApiError(error);
  }
};

export const unBanUserById = async (userid: string) => {
  try {
    const { data } = await axiosClient.patch(`/api/ban-histories/${userid}/unban`);
    return { error: null, data, success: true };
  } catch (error) {
    return handleApiError(error);
  }
};

export const followDeveloper = async (playerId: string, developerId: string) => {
  try {
    const { data } = await axiosClient.post(`/api/players/${playerId}/developers/${developerId}/user-follows`);
    return { error: null, data, success: true };
  } catch (error) {
    return handleApiError(error);
  }
};

export const getAboutUsStats = async () => {
  try {
    const totalUserResult = await axiosClient.get(`/api/dashboard/total-users`);
    const totalOnlineResult = await axiosClient.get(`/api/dashboard/online-count`);
    return {
      error: null,
      data: {
        totalUsers: totalUserResult.data,
        totalOnline: totalOnlineResult.data,
      },
      success: true,
    };
  } catch (error) {
    return handleApiError(error);
  }
};

export const ping = async () => {
  try {
    const { data } = await axiosClient.post(`/api/users/ping`);
    return { error: null, data, success: true };
  } catch (error) {
    return handleApiError(error);
  }
};