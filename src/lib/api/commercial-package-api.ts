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

export const getAllCommercialPackages = async () => {
  try {
    const { data } = await axiosClient.get(`/api/commercial-packages`);
    return { error: null, data: data, success: true };
  } catch (error) {
    return handleApiError(error);
  }
};


export const getCommercialPackageById = async (packageId: string) => {
  try {
    const { data } = await axiosClient.get(`/api/commercial-packages/${packageId}`);
    return { error: null, data: data, success: true };
  } catch (error) {
    return handleApiError(error);
  }
};
