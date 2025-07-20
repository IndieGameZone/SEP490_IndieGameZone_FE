import { getAllCommentReportReason, getAllGameReportReason, getAllPostReportReason } from "@/lib/api/report-api";
import { ReportReason } from "@/types/report-reason";
import { create } from "zustand";


interface reportReasonState {
  gameReportReasons: ReportReason[];
  postReportReasons: ReportReason[];
  commentReportReasons: ReportReason[];
  loading: boolean;
  error: string | null;
  fetchGameReportReasons: () => Promise<void>;
  fetchPostReportReasons: () => Promise<void>;
  fetchCommentReportReasons: () => Promise<void>;
  renderKey: number;
  rerender: () => void;
}

const useReportReasonStore = create<reportReasonState>((set) => ({
  reportReasons: [],
  gameReportReasons: [],
  postReportReasons: [],
  commentReportReasons: [],
  loading: false,
  error: null,
  renderKey: 0,
  rerender: () => {
    set((prev) => ({ renderKey: prev.renderKey + 1 }));
  },

  fetchGameReportReasons: async () => {
    set({ loading: true, error: null });
    try {
      const response = await getAllGameReportReason();
      if (!response.error) {
        set({ gameReportReasons: response.data, loading: false });
      } else {
        set({ loading: false, error: response.error });
      }
    } catch (error: any) {
      set({ loading: false, error: error.message });
    }
  },
  fetchPostReportReasons: async () => {
    set({ loading: true, error: null });
    try {
      const response = await getAllPostReportReason();
      if (!response.error) {
        set({ postReportReasons: response.data, loading: false });
      } else {
        set({ loading: false, error: response.error });
      }
    } catch (error: any) {
      set({ loading: false, error: error.message });
    }
  },
  fetchCommentReportReasons: async () => {
    set({ loading: true, error: null });
    try {
      const response = await getAllCommentReportReason();
      if (!response.error) {
        set({ commentReportReasons: response.data, loading: false });
      } else {
        set({ loading: false, error: response.error });
      }
    } catch (error: any) {
      set({ loading: false, error: error.message });
    }
  },
}));

export default useReportReasonStore;
