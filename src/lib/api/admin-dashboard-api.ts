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

export const getDashboardSummary = async () => {
    try {
        const { data } = await axiosClient.get(`/api/dashboard/summary`);
        return {
            error: null, data: data, success: true
        };
    } catch (error) {
        return handleApiError(error);
    }
};

export const getTopDownloadedGames = async (top?: number) => {
    try {
        const searchParams = new URLSearchParams();
        if (top) searchParams.append("top", top.toString());
        const queryString = searchParams.toString();
        const url = queryString ? `/api/dashboard/top-downloaded-games?${queryString}` : "/api/dashboard/top-downloaded-games";
        const { data } = await axiosClient.get(url);
        return {
            error: null, data: data, success: true
        };
    } catch (error) {
        return handleApiError(error);
    }
};

export const getTopRatedGames = async (top?: number) => {
    try {
        const searchParams = new URLSearchParams();
        if (top) searchParams.append("top", top.toString());
        const queryString = searchParams.toString();
        const url = queryString ? `/api/dashboard/top-rated?${queryString}` : "/api/dashboard/top-rated";
        const { data } = await axiosClient.get(url);
        return {
            error: null, data: data, success: true
        };
    } catch (error) {
        return handleApiError(error);
    }
};


export const getBestSellingGames = async (top?: number) => {
    try {
        const searchParams = new URLSearchParams();
        if (top) searchParams.append("top", top.toString());
        const queryString = searchParams.toString();
        const url = queryString ? `/api/dashboard/top-selling?${queryString}` : "/api/dashboard/top-selling";
        const { data } = await axiosClient.get(url);
        return {
            error: null, data: data, success: true
        };
    } catch (error) {
        return handleApiError(error);
    }
};

export const getRecentlyPublishedGames = async (top?: number) => {
    try {
        const searchParams = new URLSearchParams();
        if (top) searchParams.append("top", top.toString());
        const queryString = searchParams.toString();
        const url = queryString ? `/api/dashboard/recently-published?${queryString}` : "/api/dashboard/recently-published";
        const { data } = await axiosClient.get(url);
        return {
            error: null, data: data, success: true
        };
    } catch (error) {
        return handleApiError(error);
    }
};