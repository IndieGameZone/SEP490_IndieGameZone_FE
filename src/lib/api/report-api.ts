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
export const getAllReportReason = async () => {
    try {
        const { data } = await axiosClient.get(`/api/report-reasons`);
        return { error: null, data: data, success: true };
    } catch (error) {
        return handleApiError(error);
    }
};

export const createReportReason = async (reportReasonData: { name: string }) => {
    try {
        const { data } = await axiosClient.post('/api/report-reasons', reportReasonData);
        return { error: null, data: data, success: true };
    } catch (error) {
        return handleApiError(error);
    }
};

export const updateReportReason= async (reportReasonId: string | number, reportReasonData: { name: string }) => {
    try {
        const { data } = await axiosClient.put(`/api/report-reasons/${reportReasonId}`, reportReasonData);
        return { error: null, data: data, success: true };
    } catch (error) {
        return handleApiError(error);
    }
};

export const deleteReportReason = async (reportReasonId: string | number) => {
    try {
        const { data } = await axiosClient.delete(`/api/report-reasons/${reportReasonId}`);
        return { error: null, data: data, success: true };
    } catch (error) {
        return handleApiError(error);
    }
};

export const getReportReasonById = async (reportReasonId: string | number) => {
    try {
        const { data } = await axiosClient.get(`/api/report-reasons/${reportReasonId}`);
        return { error: null, data: data, success: true };
    } catch (error) {
        return handleApiError(error);
    }
};