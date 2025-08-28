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

export const getAllGameReportReason = async () => {
  try {
    const { data } = await axiosClient.get(`/api/report-reasons`, {
      params: {
        ReportReasonType: "Game",
      },
    });
    return { error: null, data: data, success: true };
  } catch (error) {
    return handleApiError(error);
  }
};
export const getAllCommentReportReason = async () => {
  try {
    const { data } = await axiosClient.get(`/api/report-reasons`, {
      params: {
        ReportReasonType: "Comment",
      },
    });
    return { error: null, data: data, success: true };
  } catch (error) {
    return handleApiError(error);
  }
};
export const getAllReviewReportReason = async () => {
  try {
    const { data } = await axiosClient.get(`/api/report-reasons`, {
      params: {
        ReportReasonType: "Review",
      },
    });
    return { error: null, data: data, success: true };
  } catch (error) {
    return handleApiError(error);
  }
};
export const getAllPostReportReason = async () => {
  try {
    const { data } = await axiosClient.get(`/api/report-reasons`, {
      params: {
        ReportReasonType: "Post",
      },
    });
    return { error: null, data: data, success: true };
  } catch (error) {
    return handleApiError(error);
  }
};

export const createReportReason = async (reportReasonData: { name: string; type: string }) => {
  try {
    const { data } = await axiosClient.post("/api/report-reasons", reportReasonData);
    return { error: null, data: data, success: true };
  } catch (error) {
    return handleApiError(error);
  }
};

export const updateReportReason = async (reportReasonId: string | number, reportReasonData: { name: string }) => {
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

export interface ReportCommentData {
  message: string;
  reportReasonId: string;
  commentId: string;
  postId: string;

  gameId: string;
}

export const createReportComment = async (userId: string, reportCommentData: ReportCommentData) => {
  try {
    const { data } = await axiosClient.post(`/api/users/${userId}/comment-reports`, reportCommentData);

    return { error: null, data: data, success: true };
  } catch (error) {
    return handleApiError(error);
  }
};

export interface ReportGameData {
  message: string;
  reportReasonId: string;
  gameId: string;
}

export const createReportGame = async (userId: string, reportGameData: ReportGameData) => {
  try {
    const { data } = await axiosClient.post(`/api/users/${userId}/game-reports`, reportGameData);

    return { error: null, data: data, success: true };
  } catch (error) {
    return handleApiError(error);
  }
};

export interface ReportPostData {
  message: string;
  reportReasonId: string;
  postId: string;
  gameId: string;
}

export const createReportPost = async (userId: string, reportPostData: ReportPostData) => {
  try {
    const { data } = await axiosClient.post(`/api/users/${userId}/post-reports`, reportPostData);

    return { error: null, data: data, success: true };
  } catch (error) {
    return handleApiError(error);
  }
};
export const getAllReport = async () => {
  try {
    const { data } = await axiosClient.get(`/api/reports`);
    return { error: null, data: data, success: true };
  } catch (error) {
    return handleApiError(error);
  }
};
export const changeStatusReport = async (id: string, status: "true" | "false") => {
  try {
    const { data } = await axiosClient.put(`/api/reports/${id}/resolve-status`, { status });
    return { error: null, data: data, success: true };
  } catch (error) {
    return handleApiError(error);
  }
};

export const getReportByReporting = async (reportingUserId: string) => {
  try {
    const { data } = await axiosClient.get(`/api/reporting-users/${reportingUserId}/reports`);
    return { error: null, data: data, success: true };
  } catch (error) {
    return handleApiError(error);
  }
};
export const getReportByReported = async (reportedUserId: string) => {
  try {
    const { data } = await axiosClient.get(`/api/reported-users/${reportedUserId}/reports`);
    return { error: null, data: data, success: true };
  } catch (error) {
    return handleApiError(error);
  }
};

export const updateStatusReport = async (
  id: string,
  UpdatedStatus: "Approved" | "Rejected" | "Pending",
  reviewMessage: string
) => {
  try {
    const { data } = await axiosClient.patch(`/api/reports/${id}/resolve-status?updatedStatus=${UpdatedStatus}`, {
      reviewMessage,
    });
    return { error: null, data: data, success: true };
  } catch (error) {
    return handleApiError(error);
  }
};
