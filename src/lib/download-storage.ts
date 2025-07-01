import { DownloadEntry } from "@/types/download-entry";

export class DownloadStorage {
    private dbName = 'DownloadChunks';
    private version = 1;
    private db: IDBDatabase | null = null;

    async init(): Promise<void> {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.version);
            
            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                this.db = request.result;
                resolve();
            };
            
            request.onupgradeneeded = (event) => {
                const db = (event.target as IDBOpenDBRequest).result;
                
                // Create object store for chunks
                if (!db.objectStoreNames.contains('chunks')) {
                    const store = db.createObjectStore('chunks', { keyPath: 'id' });
                    store.createIndex('downloadId', 'downloadId', { unique: false });
                }
                
                // Create object store for download metadata
                if (!db.objectStoreNames.contains('downloads')) {
                    db.createObjectStore('downloads', { keyPath: 'id' });
                }
            };
        });
    }

    async storeChunk(downloadId: string, chunkIndex: number, chunk: Uint8Array): Promise<void> {
        if (!this.db) await this.init();
        
        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction(['chunks'], 'readwrite');
            const store = transaction.objectStore('chunks');
            
            const request = store.put({
                id: `${downloadId}_${chunkIndex}`,
                downloadId,
                chunkIndex,
                data: chunk
            });
            
            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve();
        });
    }

    async getChunks(downloadId: string): Promise<Uint8Array[]> {
        if (!this.db) await this.init();
        
        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction(['chunks'], 'readonly');
            const store = transaction.objectStore('chunks');
            const index = store.index('downloadId');
            
            const request = index.getAll(downloadId);
            
            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                const chunks = request.result
                    .sort((a, b) => a.chunkIndex - b.chunkIndex)
                    .map(item => item.data);
                resolve(chunks);
            };
        });
    }

    async deleteChunks(downloadId: string): Promise<void> {
        if (!this.db) await this.init();
        
        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction(['chunks'], 'readwrite');
            const store = transaction.objectStore('chunks');
            const index = store.index('downloadId');
            
            const request = index.getAllKeys(downloadId);
            
            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                const keys = request.result;
                let deleted = 0;
                
                if (keys.length === 0) {
                    resolve();
                    return;
                }
                
                keys.forEach(key => {
                    const deleteRequest = store.delete(key);
                    deleteRequest.onsuccess = () => {
                        deleted++;
                        if (deleted === keys.length) resolve();
                    };
                    deleteRequest.onerror = () => reject(deleteRequest.error);
                });
            };
        });
    }

    async getChunkCount(downloadId: string): Promise<number> {
        if (!this.db) await this.init();
        
        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction(['chunks'], 'readonly');
            const store = transaction.objectStore('chunks');
            const index = store.index('downloadId');
            
            const request = index.count(downloadId);
            
            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result);
        });
    }

    async storeDownloadMetadata(download: DownloadEntry): Promise<void> {
        if (!this.db) await this.init();
        
        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction(['downloads'], 'readwrite');
            const store = transaction.objectStore('downloads');
            
            const request = store.put(download);
            
            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve();
        });
    }

    async getAllDownloadMetadata(): Promise<DownloadEntry[]> {
        if (!this.db) await this.init();
        
        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction(['downloads'], 'readonly');
            const store = transaction.objectStore('downloads');
            
            const request = store.getAll();
            
            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result);
        });
    }

    async deleteDownloadMetadata(downloadId: string): Promise<void> {
        if (!this.db) await this.init();
        
        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction(['downloads'], 'readwrite');
            const store = transaction.objectStore('downloads');
            
            const request = store.delete(downloadId);
            
            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve();
        });
    }

    async getDownloadsWithChunks(): Promise<string[]> {
        if (!this.db) await this.init();
        
        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction(['chunks'], 'readonly');
            const store = transaction.objectStore('chunks');
            const index = store.index('downloadId');
            
            const request = index.getAllKeys();
            
            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                const downloadIds = new Set<string>();
                request.result.forEach(key => {
                    const chunkId = key as string;
                    const downloadId = chunkId.split('_')[0];
                    downloadIds.add(downloadId);
                });
                resolve(Array.from(downloadIds));
            };
        });
    }
}
