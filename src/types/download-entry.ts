type DownloadStatus = 'idle' | 'downloading' | 'success' | 'error' | 'cancelled';

export type DownloadEntry = {
    id: string;
    url: string;
    filename: string;
    status: DownloadStatus;
    error?: string;
    progress: number;
};
