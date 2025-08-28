/**
 * Download Store (zustand + IndexedDB)
 *
 * This store manages file downloads in the browser, supporting pause, resume,
 * and recovery across app restarts using IndexedDB for persistence. It handles
 * download lifecycle, chunked streaming, and retry logic.
 *
 * Structure:
 * ---------------
 * - State:
 *   - `downloads`: Tracks all active/downloaded file entries.
 *   - `isRehydrated`: Flags when stored downloads have been loaded from disk.
 *
 * - Public Actions:
 *   - `startDownload(url, filename)`: Begins a new download.
 *   - `pauseDownload(id)`: Pauses an in-progress download.
 *   - `resumeDownload(id)`: Resumes a paused download (supports partial resume).
 *   - `cancelDownload(id)`: Cancels and deletes a download.
 *   - `deleteDownload(id)`: Deletes completely a download.
 *   - `updateDownload(id, patch)`: Updates the metadata and persists it.
 *   - `rehydrateDownloads()`: Loads previous download state from IndexedDB.
 *
 * - Internal Utilities:
 *   - `_performDownload(...)`: Core streaming logic to read and store chunks.
 *   - `_processStreamData(...)`: Handles reading from the stream and storing data.
 *   - `_completeDownload(...)`: Finalizes and saves the downloaded file.
 *   - `_handleDownloadError(...)`: Processes network/user abort errors.
 *   - `_restartDownload(...)`: Clears previous state and restarts from byte 0.
 *   - `_createFetchRequest(...)`: Constructs range-aware fetch request.
 *   - `_calculateTotalBytes(...)`: Derives full file size for progress tracking.
 *   - `_updateDownloadProgress(...)`: Updates progress and ETA with throttling.
 *   - `_cleanupDownload(...)`: Cleans up memory state like abort controllers.
 *
 * Dependencies:
 * - `zustand`: State management.
 * - `DownloadStorage`: IndexedDB helper for chunk + metadata persistence.
 * - `DownloadEntry`: Type definition for individual download info.
 *
 * Notes:
 * - Resume support depends on HTTP range support (`accept-ranges: bytes`).
 * - All download state is persistently stored in IndexedDB.
 * - Network errors result in deletion unless handled differently by design.
 */

import { DownloadStorage } from "@/lib/download-storage";
import { DownloadEntry } from "@/types/download-entry";
import { MessageInstance } from "antd/es/message/interface";
import { create } from "zustand";

type DownloadState = {
    downloads: Record<string, DownloadEntry>;
    isRehydrated: boolean;
    startDownload: (url: string, filename: string, messageApi?: MessageInstance) => void;
    pauseDownload: (id: string) => void;
    resumeDownload: (id: string) => void;
    updateDownload: (id: string, patch: Partial<DownloadEntry>) => void;
    cancelDownload: (id: string) => void;
    deleteDownload: (id: string) => Promise<void>;
    rehydrateDownloads: () => Promise<void>;
    _performDownload: (id: string, startAt: number) => void;
    _restartDownload: (id: string) => void;
    _createFetchRequest: (url: string, startByte: number, supportsResume: boolean, signal: AbortSignal) => any;
    _calculateTotalBytes: (response: Response, startByte: number, currentTotal?: number) => number | undefined;
    _updateDownloadProgress: (
        id: string,
        received: number,
        total: number | undefined,
        startTime: number,
        lastUpdate: number
    ) => number;
    _processStreamData: (
        reader: ReadableStreamDefaultReader<Uint8Array>,
        id: string,
        startByte: number,
        totalBytes: number | undefined,
        startTime: number
    ) => Promise<void>;
    _completeDownload: (id: string, filename: string) => Promise<void>;
    _handleDownloadError: (error: any, id: string) => Promise<void>;
    _cleanupDownload: (id: string) => void;
};

const abortControllers: Record<string, AbortController> = {};

// IndexedDB helper class for storing download chunks
const downloadStorage = new DownloadStorage();

// Check if server supports range requests
const checkResumeSupport = async (url: string): Promise<boolean> => {
    try {
        const response = await fetch(url, { method: 'HEAD' });
        console.log(response);
        return response.headers.get('accept-ranges') === 'bytes';
    } catch {
        return false;
    }
};

const isRetryableError = (error?: string): boolean => {
    if (!error) return true;
    return !error.includes("The specified blob does not exist");
};

const useDownloadStore = create<DownloadState>((set, get) => ({
    downloads: {},
    isRehydrated: false,

    rehydrateDownloads: async () => {
        try {
            await downloadStorage.init();

            // Get all stored download metadata
            const storedDownloads = await downloadStorage.getAllDownloadMetadata();

            // Get downloads that have chunks (in case metadata is missing)
            const downloadsWithChunks = await downloadStorage.getDownloadsWithChunks();

            // Filter for downloads that were in progress when the app closed
            const rehydratedDownloads: Record<string, DownloadEntry> = {};

            for (const download of storedDownloads) {
                // Only rehydrate downloads that were downloading or paused
                if (download.status === 'downloading' || download.status === 'paused') {
                    // Check if chunks still exist
                    const chunkCount = await downloadStorage.getChunkCount(download.id);
                    if (chunkCount > 0) {
                        // Set status to paused for rehydrated downloads
                        rehydratedDownloads[download.id] = {
                            ...download,
                            status: 'paused',
                            pausedAt: Date.now(),
                        };
                    } else {
                        // No chunks found, clean up metadata
                        await downloadStorage.deleteDownloadMetadata(download.id);
                    }
                } else if (download.status === 'success' || download.status === 'error' || download.status === 'cancelled') {
                    // Clean up completed/failed downloads and their chunks
                    await downloadStorage.deleteChunks(download.id);
                    await downloadStorage.deleteDownloadMetadata(download.id);
                }
            }

            // Clean up orphaned chunks (chunks without metadata)
            for (const downloadId of downloadsWithChunks) {
                if (!storedDownloads.find(d => d.id === downloadId)) {
                    await downloadStorage.deleteChunks(downloadId);
                }
            }
            // console.log(rehydratedDownloads);

            set(state => ({
                ...state,
                downloads: { ...state.downloads, ...rehydratedDownloads },
                isRehydrated: true,
            }));

        } catch (error) {
            console.error('Failed to rehydrate downloads:', error);
            set(state => ({ ...state, isRehydrated: true }));
        }
    },

    startDownload: async (url, filename, messageApi) => {
        const existings = Object.values(get().downloads);
        if (existings.filter(x => x.status == "downloading").length > 2) {
            messageApi?.error("Cannot download more than 2 files at the same time!");
            return;
        } else if (
            existings.find(
                (entry) =>
                    entry.url === url &&
                    (entry.status === "downloading" || entry.status === "paused")
            )
        ) {
            messageApi?.error("Download is already in process!");
            return;
        }

        const id = crypto.randomUUID();
        const controller = new AbortController();
        abortControllers[id] = controller;
        const startedAt = Date.now();

        // Initialize IndexedDB if needed
        await downloadStorage.init();

        // Check if server supports resume
        const supportsResume = await checkResumeSupport(url);

        const downloadEntry: DownloadEntry = {
            id,
            url,
            filename,
            status: 'downloading',
            progress: 0,
            receivedBytes: 0,
            totalBytes: 0,
            startedAt,
            supportsResume,
            retryable: true,
        };

        set(state => ({
            downloads: {
                ...state.downloads,
                [id]: downloadEntry,
            },
        }));

        // Store initial metadata in IndexedDB
        await downloadStorage.storeDownloadMetadata(downloadEntry);

        get()._performDownload(id, 0); // Start from byte 0
    },

    pauseDownload: async (id) => {
        const controller = abortControllers[id];
        if (controller) {
            controller.abort();
            delete abortControllers[id];
        }

        const updatedDownload = {
            ...get().downloads[id],
            status: 'paused' as const,
            pausedAt: Date.now(),
        };

        set(state => ({
            downloads: {
                ...state.downloads,
                [id]: updatedDownload,
            },
        }));

        // Update metadata in IndexedDB
        await downloadStorage.storeDownloadMetadata(updatedDownload);
    },

    resumeDownload: async (id) => {
        const download = get().downloads[id];
        if (!download || download.status !== 'paused') return;

        if (!download.supportsResume) {
            // If resume not supported, restart from beginning
            await get()._restartDownload(id);
            return;
        }

        const controller = new AbortController();
        abortControllers[id] = controller;

        const updatedDownload = {
            ...download,
            status: 'downloading' as const,
            pausedAt: undefined,
        };

        set(state => ({
            downloads: {
                ...state.downloads,
                [id]: updatedDownload,
            },
        }));

        // Update metadata in IndexedDB
        await downloadStorage.storeDownloadMetadata(updatedDownload);

        // Resume from where we left off
        get()._performDownload(id, download.receivedBytes || 0);
    },

    _restartDownload: async (id: string) => {
        const download = get().downloads[id];
        if (!download) return;

        // Clear existing chunks from IndexedDB
        await downloadStorage.deleteChunks(id);

        const controller = new AbortController();
        abortControllers[id] = controller;

        set(state => ({
            downloads: {
                ...state.downloads,
                [id]: {
                    ...state.downloads[id],
                    status: 'downloading',
                    progress: 0,
                    receivedBytes: 0,
                    startedAt: Date.now(),
                    pausedAt: undefined,
                },
            },
        }));

        get()._performDownload(id, 0);
    },

    _createFetchRequest: (url: string, startByte: number, supportsResume: boolean, signal: AbortSignal) => {
        const headers: Record<string, string> = {};
        if (startByte > 0 && supportsResume) {
            headers['Range'] = `bytes=${startByte}-`;
        }
        return fetch(url, { signal, headers });
    },

    _calculateTotalBytes: (response: Response, startByte: number, currentTotal?: number) => {
        if (currentTotal) return currentTotal;

        const contentLength = response.headers.get('content-length');
        if (!contentLength) return undefined;

        let total = parseInt(contentLength, 10);
        if (startByte > 0) {
            total += startByte; // Adjust for partial content
        }
        return total;
    },

    _updateDownloadProgress: (
        id: string,
        received: number,
        total: number | undefined,
        startTime: number,
        lastUpdate: number
    ) => {
        const now = Date.now();

        // Throttle UI updates to once per second
        if (now - lastUpdate > 1000) {
            const elapsedSec = (now - startTime) / 1000;
            const speed = received / elapsedSec; // bytes/sec
            const eta = total ? (total - received) / speed : undefined;

            set(state => ({
                downloads: {
                    ...state.downloads,
                    [id]: {
                        ...state.downloads[id],
                        progress: total ? received / total : 0,
                        receivedBytes: received,
                        totalBytes: total,
                        estimatedTimeLeft: eta,
                    },
                },
            }));
            return now; // Return new lastUpdate timestamp
        }
        return lastUpdate; // Return unchanged timestamp
    },

    _processStreamData: async (
        reader: ReadableStreamDefaultReader<Uint8Array>,
        id: string,
        startByte: number,
        totalBytes: number | undefined,
        startTime: number
    ) => {
        let received = startByte;
        let chunkIndex = await downloadStorage.getChunkCount(id);
        let lastUpdate = Date.now();

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            if (value) {
                // Store chunk in IndexedDB
                await downloadStorage.storeChunk(id, chunkIndex++, value);
                received += value.length;

                // Update progress with throttling
                lastUpdate = get()._updateDownloadProgress(
                    id, received, totalBytes, startTime, lastUpdate
                );
            }
        }
    },

    _completeDownload: async (id: string, filename: string) => {
        // Retrieve chunks from IndexedDB and create download
        const chunks = await downloadStorage.getChunks(id);
        const blob = new Blob(chunks);
        const blobUrl = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = filename;
        link.click();

        setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);

        // Clean up chunks and metadata from IndexedDB
        await downloadStorage.deleteChunks(id);
        await downloadStorage.deleteDownloadMetadata(id);

        get().updateDownload(id, {
            status: 'success', progress: 1, receivedBytes: blob.size,
            totalBytes: blob.size,
        });
    },

    _handleDownloadError: async (error: any, id: string) => {
        if (error.name === "AbortError") {
            const currentDownload = get().downloads[id];
            if (currentDownload?.status !== 'paused') {
                await downloadStorage.deleteChunks(id);
                await downloadStorage.deleteDownloadMetadata(id);
                get().updateDownload(id, {
                    status: 'cancelled',
                    error: "Download cancelled by user"
                });
            }
        } else {
            await downloadStorage.deleteChunks(id);
            await downloadStorage.deleteDownloadMetadata(id);
            get().updateDownload(id, {
                status: 'error',
                error: error.message,
                retryable: isRetryableError(error.message)
            });
        }
    },

    _cleanupDownload: (id: string) => {
        const currentDownload = get().downloads[id];
        if (currentDownload?.status !== 'paused') {
            delete abortControllers[id];
        }
    },

    _performDownload: async (id: string, startByte: number) => {
        const download = get().downloads[id];
        if (!download) return;

        const controller = abortControllers[id];
        if (!controller) return;

        try {
            // Create and execute fetch request
            const response = await get()._createFetchRequest(
                download.url,
                startByte,
                download.supportsResume || false,
                controller.signal
            );

            if (!response.ok && response.status !== 206) {
                throw new Error(response.statusText ?? 'Failed to fetch file');
            }

            // Calculate total bytes and update if needed
            const totalBytes = get()._calculateTotalBytes(response, startByte, download.totalBytes);
            if (totalBytes && !download.totalBytes) {
                get().updateDownload(id, { totalBytes });
            }

            // Get stream reader
            const reader = response.body?.getReader();
            if (!reader) throw new Error('No stream available');

            // Process stream data
            await get()._processStreamData(
                reader,
                id,
                startByte,
                totalBytes,
                download.startedAt || Date.now()
            );

            // Complete download
            await get()._completeDownload(id, download.filename);

        } catch (error: any) {
            await get()._handleDownloadError(error, id);
        } finally {
            get()._cleanupDownload(id);
        }
    },

    updateDownload: async (id, patch) => {
        const updatedDownload = { ...get().downloads[id], ...patch };

        set(state => ({
            downloads: {
                ...state.downloads,
                [id]: updatedDownload,
            },
        }));

        // Update metadata in IndexedDB for persistent storage
        if (get().isRehydrated) {
            await downloadStorage.storeDownloadMetadata(updatedDownload);
        }
    },

    cancelDownload: async (id) => {
        const controller = abortControllers[id];
        if (controller) {
            controller.abort();
            delete abortControllers[id];
        }

        // Clean up chunks and metadata from IndexedDB
        await downloadStorage.deleteChunks(id);
        await downloadStorage.deleteDownloadMetadata(id);

        set(state => ({
            downloads: {
                ...state.downloads,
                [id]: {
                    ...state.downloads[id],
                    status: 'cancelled',
                    error: "Download cancelled by user"
                },
            },
        }));
    },
    deleteDownload: async (id: string) => {
        const controller = abortControllers[id];
        if (controller) {
            controller.abort();
            delete abortControllers[id];
        }

        await downloadStorage.deleteChunks(id);
        await downloadStorage.deleteDownloadMetadata(id);

        set(state => {
            const { [id]: _, ...remaining } = state.downloads;
            return { downloads: remaining };
        });
    }
}));

export default useDownloadStore;