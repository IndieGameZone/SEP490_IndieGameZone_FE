import { axiosClient } from './config/axios-client';

export const handleApiError = (error: any) => {
    try {
        const errorMessage = error.response?.data.message || error?.message || 'An unexpected error occurred.';
        const data = null;
        return { error: errorMessage, data };
    } catch (err) {
        throw new Error('An unexpected error occurred.');
    }
};

type AddGameFilesRequest = {
    platformId: string;
    file: string;
}[];

export const addGameFiles = async (gameId: string, request: AddGameFilesRequest) => {
    try {
        const { data } = await axiosClient.post(`/api/games/${gameId}/game-platforms`, request);
        return { error: null, data: data, success: true };
    } catch (error) {
        return handleApiError(error);
    }
}

type AddGameRequest = {
    name: string;
    coverImage: string;
    videoLink: string;
    shortDescription: string;
    installInstruction: string;
    description: string;
    allowDonation: boolean;
    status: string;
    visibility: string;
    price: number;
    averageSession: number;
    ageRestrictionId: string;
    categoryId: string;
    languageIds: string[];
    tagIds: string[];
    gameImages: string[];
}
export const addGame = async (developerId: string, request: AddGameRequest) => {
    const formData = new FormData();
    formData.append("Name", request.name);
    formData.append("CoverImage", request.coverImage);
    formData.append("VideoLink", request.videoLink);
    formData.append("ShortDescription", request.shortDescription);
    formData.append("InstallInstruction", request.installInstruction);
    formData.append("Description", request.description);
    formData.append("AllowDonation", request.allowDonation ? "true" : "false");
    formData.append("Status", request.status);
    formData.append("Visibility", request.visibility);
    formData.append("categoryId", request.categoryId);
    formData.append("Price", request.price + "");
    formData.append("AverageSession", request.averageSession + "");
    formData.append("AgeRestrictionId", request.ageRestrictionId);
    request.languageIds.forEach(x => {
        formData.append("LanguageIds", x);
    })
    request.tagIds.forEach(x => {
        formData.append("TagIds", x)
    })
    request.gameImages.forEach(x => {
        formData.append("GameImages", x)
    })
    try {
        const { data } = await axiosClient.post(`/api/users/${developerId}/games`, formData);
        return { error: null, data: data, success: true };
    } catch (error) {
        return handleApiError(error);
    }
}
