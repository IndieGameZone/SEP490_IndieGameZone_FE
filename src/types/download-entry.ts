export type DownloadStatus = 'idle' | 'downloading' | 'paused' | 'success' | 'error' | 'cancelled';

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
    pausedAt?: number;        // timestamp when paused
    estimatedTimeLeft?: number; 
    supportsResume?: boolean;
    retryable?: boolean;
};