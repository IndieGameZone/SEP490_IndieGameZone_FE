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

export const getUserObtainedAchievements = async (userId: string) => {
  try {
    const { data } = await axiosClient.get(`/api/users/${userId}/obtained-achievements`);
    return { error: null, data: data, success: true };
  } catch (error) {
    return handleApiError(error);
  }
};
export const getAllAchievements = async () => {
    try {
        const { data } = await axiosClient.get(`/api/achievements`);
        return { error: null, data: data, success: true };
    } catch (error) {
        return handleApiError(error);
    }
};
export const updateAchievement = async (id: string, achievementData: { name: string }) => {
    try {
        const { data } = await axiosClient.put(`/api/achievements/${id}`, achievementData);
        return { error: null, data: data, success: true };
    } catch (error) {
        return handleApiError(error);
    }
};

export const deleteAchievement = async (id: string) => {
    try {
        const { data } = await axiosClient.delete(`/api/achievements/${id}`);
        return { error: null, data: data, success: true };
    } catch (error) {
        return handleApiError(error);
    }
};
