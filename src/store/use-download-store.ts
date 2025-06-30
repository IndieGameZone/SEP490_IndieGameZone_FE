import { DownloadEntry } from "@/types/download-entry";
import { create } from "zustand";

type DownloadState = {
    downloads: Record<string, DownloadEntry>;
    startDownload: (url: string, filename: string) => void;
    updateDownload: (id: string, patch: Partial<DownloadEntry>) => void;
    cancelDownload: (id: string) => void;
};

const abortControllers: Record<string, AbortController> = {};

const useDownloadStore = create<DownloadState>((set, get) => ({
    downloads: {
        // "1": {
        //     id: "1",
        //     url: "https://www.google.com",
        //     filename: "installer.exe",
        //     status: "downloading",
        //     progress: 0.75,
        //     totalBytes: 50 * 1024 * 1024,
        //     receivedBytes: 39_321_600
        // }
    },
    startDownload: async (url, filename) => {
        const id = crypto.randomUUID();

        const controller = new AbortController();
        abortControllers[id] = controller;

        const startedAt = Date.now();
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
                },
            },
        }));

        try {
            const response = await fetch(url, { signal: controller.signal });
            if (!response.ok) throw new Error('Failed to fetch file');

            const contentLength = response.headers.get('content-length');
            if (!contentLength) throw new Error('No content-length header');

            const total = parseInt(contentLength, 10);
            const reader = response.body?.getReader();
            if (!reader) throw new Error('No stream available');
            get().updateDownload(id, { totalBytes: total });

            const chunks: Uint8Array[] = [];
            let received = 0;

            let lastUpdate = Date.now();
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                if (value) {
                    chunks.push(value);
                    received += value.length;
                    // Calculate ETA (estimated arrival time)
                    const now = Date.now();

                    // Throttle update to 1 update per second
                    if (now - lastUpdate > 1000) {
                        const elapsedSec = (now - startedAt) / 1000;
                        const speed = received / elapsedSec; // bytes/sec
                        const eta = (total - received) / speed; // seconds
                        set(state => ({
                            downloads: {
                                ...state.downloads,
                                [id]: {
                                    ...state.downloads[id],
                                    progress: received / total,
                                    receivedBytes: received,
                                    totalBytes: total,
                                    estimatedTimeLeft: eta,
                                },
                            },
                        }));
                        lastUpdate = now;
                    }
                }
            }
            const blob = new Blob(chunks);
            const blobUrl = URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = filename;
            link.click();

            setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);

            get().updateDownload(id, { status: 'success', progress: 1 });
        } catch (e: any) {
            if (e.name == "AbortError") {
                get().updateDownload(id, { status: 'cancelled', error: "Download cancelled by user" });
            } else {
                get().updateDownload(id, { status: 'error', error: e.message });
            }
        } finally {
            delete abortControllers[id];
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
    }
}));

export default useDownloadStore;