import axios from "axios";
import { axiosClient } from "./config/axios-client";
const CLOUD_NAME = import.meta.env.VITE_REACT_APP_CLOUD_NAME;
const PRESET_NAME = import.meta.env.VITE_REACT_APP_PRESET_NAME;

export const handleApiError = (error: any) => {
    try {
        const errorMessage = error.response?.data.message || error?.message || 'An unexpected error occurred.';
        const data = null;
        return { error: errorMessage, data };
    } catch (err) {
        throw new Error('An unexpected error occurred.');
    }
};

export const uploadFile = async (file: File) => {
    try {
        const formData = new FormData();
        formData.append("file", file);
        const { data } = await axiosClient.post(`/api/files`, formData);
        return { error: null, data: data, success: true };
    } catch (error) {
        return handleApiError(error);
    }
}

export const uploadToCloudinary = async (
    file: File,
): Promise<string | null> => {
    try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', PRESET_NAME);

        const response = await axios.post(
            `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
            formData
        );

        return response.data.secure_url as string;
    } catch (error) {
        console.error('Cloudinary upload failed:', error);
        return null;
    }
};