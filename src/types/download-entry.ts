type DownloadStatus = 'idle' | 'downloading' | 'success' | 'error' | 'cancelled';

export type DownloadEntry = {
    id: string;
    url: string;
    filename: string;
    status: DownloadStatus;
    error?: string;
    progress: number;
    totalBytes?: number;
    receivedBytes?: number;
    startedAt?: number;       // timestamp in ms
    estimatedTimeLeft?: number; 
};
