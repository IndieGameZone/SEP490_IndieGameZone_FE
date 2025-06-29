export function useDownload() {
    const downloadFile = async (url: string, filename: string) => {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Download failed');

        const blob = await response.blob();
        const blobUrl = window.URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = filename;
        link.click();

        // Optional cleanup
        setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
    };
    return { downloadFile }
}