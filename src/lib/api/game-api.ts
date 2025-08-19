import { GameCensorStatus } from "@/types/game";
import { axiosClient } from "./config/axios-client";
import { toFormData } from "../object";

export const handleApiError = (error: any): { error: string | null; data: any; success: boolean } => {
  try {
    const errorMessage = error.response?.data.message || error?.message || "An unexpected error occurred.";
    const data = null;
    return { error: errorMessage, data, success: false };
  } catch (err) {
    return { error: "An unexpected error occurred.", data: null, success: false };
  }
};

type AddGameFilesRequest = {
  platformId: string;
  file: string;
  version: string;
  displayName: string;
}[];

export const addGameFiles = async (gameId: string, request: AddGameFilesRequest) => {
  try {
    const { data } = await axiosClient.post(`/api/games/${gameId}/game-platforms`, request);
    return { error: null, data: data, success: true };
  } catch (error) {
    return handleApiError(error);
  }
};

type UpdateGameFilesRequest = {
  platformId: string;
  file: string;
  version: string;
  displayName: string;
};

export const updateGameFile = async (fileId: string, request: UpdateGameFilesRequest) => {
  try {
    const { data } = await axiosClient.put(`/api/game-platforms/${fileId}`, request);
    return { error: null, data: data, success: true };
  } catch (error) {
    return handleApiError(error);
  }
};


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
  versionDescription: string;
};

export const addGame = async (developerId: string, request: AddGameRequest) => {
  const formData = new FormData();
  formData.append("Name", request.name);
  formData.append("CoverImage", request.coverImage);
  if (request.videoLink) {
    formData.append("VideoLink", request.videoLink);
  }
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
  formData.append("VersionDescription", request.versionDescription);
  request.languageIds.forEach((x) => formData.append("LanguageIds", x));
  request.tagIds.forEach((x) => formData.append("TagIds", x));
  request.gameImages.forEach((x) => formData.append("GameImages", x));
  try {
    const { data } = await axiosClient.post(`/api/users/${developerId}/games`, formData);
    return { error: null, data: data, success: true };
  } catch (error) {
    return handleApiError(error);
  }
};

type GamesByDeveloperParams = {
  searchTerm?: string;
  pageNumber?: number;
  pageSize?: number;
  censorStatus?: GameCensorStatus;
};

export const getGamesByDeveloperId = async (developerId: string, params?: GamesByDeveloperParams) => {
  try {
    const searchParams = new URLSearchParams();
    if (params?.searchTerm) searchParams.append("SearchTerm", params.searchTerm);
    if (params?.pageNumber !== undefined) searchParams.append("PageNumber", params.pageNumber.toString());
    if (params?.pageSize !== undefined) searchParams.append("PageSize", params.pageSize.toString());
    if (params?.censorStatus !== undefined) searchParams.append("CensorStatus", params.censorStatus);
    const queryString = searchParams.toString();
    const url = queryString ? `/api/users/${developerId}/games?${queryString}` : `/api/users/${developerId}/games`;
    const { data, headers } = await axiosClient.get(url);
    return { error: null, data: { games: data, headers }, success: true };
  } catch (error) {
    return handleApiError(error);
  }
};

type GameSearchParams = {
  searchTerm?: string;
  pageNumber?: number;
  pageSize?: number;
  price?: number;
  Tags?: string[];
  Languages?: string[];
  Platforms?: string[];
  Category?: string;
  sortBy?: string;
  sortDescending?: string;
  HasDiscount?: boolean;
};

export const searchGames = async (params: GameSearchParams = {}) => {
  try {
    const searchParams = new URLSearchParams();
    if (params.searchTerm) searchParams.append("SearchTerm", params.searchTerm);
    if (params.pageNumber !== undefined) searchParams.append("PageNumber", params.pageNumber.toString());
    if (params.pageSize !== undefined) searchParams.append("PageSize", params.pageSize.toString());
    if (params.price !== undefined) searchParams.append("Price", params.price.toString());
    if (params.Tags && params.Tags.length > 0) params.Tags.forEach((id) => searchParams.append("Tags", id));
    if (params.Languages && params.Languages.length > 0)
      params.Languages.forEach((id) => searchParams.append("Languages", id));
    if (params.Platforms && params.Platforms.length > 0)
      params.Platforms.forEach((id) => searchParams.append("Platforms", id));
    if (params.Category) searchParams.append("Category", params.Category);
    if (params?.sortBy !== undefined) searchParams.append("SortBy", params.sortBy);
    if (params?.sortDescending !== undefined) searchParams.append("SortDescending", params.sortDescending);
    if (params?.HasDiscount !== undefined) searchParams.append("HasDiscount", "true");

    const queryString = searchParams.toString();
    const url = queryString ? `/api/active-games?${queryString}` : "/api/active-games";

    const { data, headers } = await axiosClient.get(url);
    return { error: null, data: { games: data, headers: headers }, success: true, headers };
  } catch (error) {
    return handleApiError(error);
  }
};

export const getGameById = async (gameId: string) => {
  try {
    const { data } = await axiosClient.get(`/api/games/${gameId}`);
    return { error: null, data: data, success: true };
  } catch (error) {
    return handleApiError(error);
  }
};

export const deleteGame = async (developerId: string, gameId: string) => {
  try {
    const { data } = await axiosClient.delete(`/api/users/${developerId}/games/${gameId}`);
    return { error: null, data: data, success: true };
  } catch (error) {
    return handleApiError(error);
  }
};

export const getGameFiles = async (gameId: string) => {
  try {
    const { data } = await axiosClient.get(`/api/games/${gameId}/platform-file`);
    return { error: null, data: data, success: true };
  } catch (error) {
    return handleApiError(error);
  }
};

type GamesAsAdminParams = {
  searchTerm?: string;
  pageNumber?: number;
  pageSize?: number;
  censorStatus?: GameCensorStatus | "";
};

export const getGamesAsAdmin = async (params?: GamesAsAdminParams) => {
  try {
    const searchParams = new URLSearchParams();
    if (params?.searchTerm) searchParams.append("SearchTerm", params.searchTerm);
    if (params?.pageNumber !== undefined) searchParams.append("PageNumber", params.pageNumber.toString());
    if (params?.pageSize !== undefined) searchParams.append("PageSize", params.pageSize.toString());
    if (params?.censorStatus !== undefined && params.censorStatus != "") searchParams.append("CensorStatus", params.censorStatus);

    const queryString = searchParams.toString();
    const url = queryString ? `/api/games?${queryString}` : "/api/games";

    const { data, headers } = await axiosClient.get(url);
    return { error: null, data: { games: data, headers: headers }, success: true };
  } catch (error) {
    return handleApiError(error);
  }
};

export const updateGameActivation = async (
  gameId: string,
  censorStatus: string,
  moderatorId: string,
  censorReason: string
) => {
  try {
    const validStatuses = ["Approved", "Rejected"];
    if (!validStatuses.includes(censorStatus)) {
      return {
        error: "censorStatus must be either 'Approved' or 'Rejected'",
        data: null,
        success: false,
      };
    }

    const formData = new FormData();
    formData.append("CensorStatus", censorStatus);
    formData.append("CensorReason", censorReason);

    const { data } = await axiosClient.put(
      `/api/users/${moderatorId}/games/${gameId}/activation`,
      formData
    );

    return { error: null, data, success: true };
  } catch (error) {
    return handleApiError(error);
  }
};

export const getGameCensorLog = async (gameId: string) => {
  try {
    const { data } = await axiosClient.get(`/api/games/${gameId}/game-censor-logs`);
    return { error: null, data: data, success: true };
  } catch (error) {
    return handleApiError(error);
  }
}
export const getNumberOfGame = async () => {
  try {
    const { data } = await axiosClient.get(`/api/games/number-of-games`);
    return { error: null, data: data, success: true };
  } catch (error) {
    return handleApiError(error);
  }
};

type UpdateGameRequest = {
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
  versionDescription: string;
};


export const updateGame = async (developerId: string, gameId: string, request: UpdateGameRequest) => {
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
  formData.append("VersionDescription", request.versionDescription);
  request.languageIds.forEach((x) => formData.append("LanguageIds", x));
  request.tagIds.forEach((x) => formData.append("TagIds", x));

  try {
    const { data } = await axiosClient.put(`/api/users/${developerId}/games/${gameId}`, formData);
    return { error: null, data: data, success: true };
  } catch (error) {
    return handleApiError(error);
  }
};

type UpdateGameImagesRequest = {
  images: string[];
};

export const updateGameImages = async (gameId: string, request: UpdateGameImagesRequest) => {
  try {
    const formData = toFormData(request);
    const { data } = await axiosClient.put(`/api/games/${gameId}/game-images`, formData);
    return { error: null, data: data, success: true };
  } catch (error) {
    return handleApiError(error);
  }
};

export const toggleFileVisibility = async (developerId: string, gamePlaformId: string, status: boolean) => {
  try {
    const formData = toFormData({ isActive: status });
    const { data } = await axiosClient.put(`/api/developers/${developerId}/game-platforms/${gamePlaformId}/activation`, formData);
    return { error: null, data: data, success: true };
  } catch (error) {
    return handleApiError(error);
  }
};

export const getFileUrl = async (userId: string, gamePlaformId: string) => {
  try {
    const { data } = await axiosClient.put(`/api/users/${userId}/games/${gamePlaformId}/file-downloading`);
    return { error: null, data: data, success: true };
  } catch (error) {
    return handleApiError(error);
  }
};

export const checkGameOwnership = async (userId: string, gameId: string) => {
  try {
    const { data } = await axiosClient.get(`/api/users/${userId}/games/${gameId}/ownership-checking`);
    return { error: null, data: data, success: true };
  } catch (error) {
    return handleApiError(error);
  }
};

export const getRecommendedGames = async (userId: string) => {
  try {
    const { data } = await axiosClient.get(`/api/users/${userId}/recommended-games`);
    return { error: null, data: data, success: true };
  } catch (error) {
    return handleApiError(error);
  }
};

export const getDevActiveGames = async (developerId: string) => {
  try {
    const { data } = await axiosClient.get(`/api/users/${developerId}/active-games`);
    return { error: null, data: data, success: true };
  } catch (error) {
    return handleApiError(error);
  }
};