import { DownloadEntry } from "@/types/download-entry";
import { create } from "zustand";


type DownloadState = {
    downloads: Record<string, DownloadEntry>;
    startDownload: (url: string, filename: string) => void;
    pauseDownload: (id: string) => void;
    resumeDownload: (id: string) => void;
    updateDownload: (id: string, patch: Partial<DownloadEntry>) => void;
    cancelDownload: (id: string) => void;
    _performDownload: (id: string, startAt: number) => void;
    _restartDownload: (id: string) => void;
};

const abortControllers: Record<string, AbortController> = {};

// Check if server supports range requests
const checkResumeSupport = async (url: string): Promise<boolean> => {
    try {
        const response = await fetch(url, { method: 'HEAD' });
        return response.headers.get('accept-ranges') === 'bytes';
    } catch {
        return false;
    }
};

const useDownloadStore = create<DownloadState>((set, get) => ({
    downloads: {},

    startDownload: async (url, filename) => {
        const id = crypto.randomUUID();
        const controller = new AbortController();
        abortControllers[id] = controller;
        const startedAt = Date.now();

        // Check if server supports resume
        const supportsResume = await checkResumeSupport(url);

        set(state => ({
            downloads: {
                ...state.downloads,
                [id]: {
                    id,
                    url,
                    filename,
                    status: 'downloading',
                    progress: 0,
                    receivedBytes: 0,
                    totalBytes: 0,
                    startedAt,
                    supportsResume,
                    chunks: [],
                },
            },
        }));

        get()._performDownload(id, 0); // Start from byte 0
    },

    pauseDownload: (id) => {
        const controller = abortControllers[id];
        if (controller) {
            controller.abort();
            delete abortControllers[id];
        }

        set(state => ({
            downloads: {
                ...state.downloads,
                [id]: {
                    ...state.downloads[id],
                    status: 'paused',
                    pausedAt: Date.now(),
                },
            },
        }));
    },

    resumeDownload: (id) => {
        const download = get().downloads[id];
        if (!download || download.status !== 'paused') return;

        if (!download.supportsResume) {
            // If resume not supported, restart from beginning
            get()._restartDownload(id);
            return;
        }

        const controller = new AbortController();
        abortControllers[id] = controller;

        set(state => ({
            downloads: {
                ...state.downloads,
                [id]: {
                    ...state.downloads[id],
                    status: 'downloading',
                    pausedAt: undefined,
                },
            },
        }));

        // Resume from where we left off
        get()._performDownload(id, download.receivedBytes || 0);
    },

    _restartDownload: async (id: string) => {
        const download = get().downloads[id];
        if (!download) return;

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
                    chunks: [],
                    startedAt: Date.now(),
                    pausedAt: undefined,
                },
            },
        }));

        get()._performDownload(id, 0);
    },

    _performDownload: async (id: string, startByte: number) => {
        const download = get().downloads[id];
        if (!download) return;

        const controller = abortControllers[id];
        if (!controller) return;

        try {
            const headers: Record<string, string> = {};
            if (startByte > 0 && download.supportsResume) {
                headers['Range'] = `bytes=${startByte}-`;
            }

            const response = await fetch(download.url, {
                signal: controller.signal,
                headers
            });

            if (!response.ok && response.status !== 206) {
                throw new Error('Failed to fetch file');
            }

            let total = download.totalBytes;
            if (!total) {
                const contentLength = response.headers.get('content-length');
                if (contentLength) {
                    total = parseInt(contentLength, 10);
                    if (startByte > 0) {
                        total += startByte; // Adjust for partial content
                    }
                    get().updateDownload(id, { totalBytes: total });
                }
            }

            const reader = response.body?.getReader();
            if (!reader) throw new Error('No stream available');

            let received = startByte;
            let lastUpdate = Date.now();
            const startTime = download.startedAt || Date.now();

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                if (value) {
                    // For resumed downloads, append to existing chunks
                    const currentDownload = get().downloads[id];
                    const newChunks = [...currentDownload.chunks, value];

                    received += value.length;
                    const now = Date.now();

                    // Throttle updates to once per second
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
                                    chunks: newChunks,
                                },
                            },
                        }));
                        lastUpdate = now;
                    } else {
                        // Update chunks without triggering full re-render
                        set(state => ({
                            downloads: {
                                ...state.downloads,
                                [id]: {
                                    ...state.downloads[id],
                                    chunks: newChunks,
                                    receivedBytes: received,
                                },
                            },
                        }));
                    }
                }
            }

            // Download completed successfully
            const finalDownload = get().downloads[id];
            const blob = new Blob(finalDownload.chunks);
            const blobUrl = URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = download.filename;
            link.click();

            setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);

            get().updateDownload(id, { status: 'success', progress: 1 });

        } catch (e: any) {
            if (e.name === "AbortError") {
                // Check if this was a pause (status already set to paused) or cancel
                const currentDownload = get().downloads[id];
                if (currentDownload?.status !== 'paused') {
                    get().updateDownload(id, {
                        status: 'cancelled',
                        error: "Download cancelled by user"
                    });
                }
            } else {
                get().updateDownload(id, {
                    status: 'error',
                    error: e.message
                });
            }
        } finally {
            // Only delete controller if not paused (paused downloads keep their data)
            const currentDownload = get().downloads[id];
            if (currentDownload?.status !== 'paused') {
                delete abortControllers[id];
            }
        }
    },

    updateDownload: (id, patch) =>
        set(state => ({
            downloads: {
                ...state.downloads,
                [id]: { ...state.downloads[id], ...patch },
            },
        })),

    cancelDownload: (id) => {
        const controller = abortControllers[id];
        if (controller) {
            controller.abort();
            delete abortControllers[id];
        }

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
    }
}));

export default useDownloadStore;