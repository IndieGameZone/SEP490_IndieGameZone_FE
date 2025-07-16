import { getAllReportReason } from '@/lib/api/report-api';
import { ReportReason } from '@/types/report-reason';
import { create } from 'zustand';


interface reportReasonState {
    reportReasons: ReportReason[];
    loading: boolean;
    error: string | null;
    fetchReportReasons: () => Promise<void>;
    renderKey: number;
    rerender: () => void;
}

const useReportReasonStore = create<reportReasonState>((set) => ({
    reportReasons: [],
    loading: false,
    error: null,
    renderKey: 0,
    rerender: () => {
        set(prev => ({ renderKey: prev.renderKey + 1 }))
    },
    fetchReportReasons: async () => {
        set({ loading: true, error: null });
        try {
            const response = await getAllReportReason();
            if (!response.error) {
                set({ reportReasons: response.data, loading: false });
            } else {
                set({ loading: false, error: response.error });
            }
        } catch (error: any) {
            set({ loading: false, error: error.message });
        }
    },
}));

export default useReportReasonStore;