export const getBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
    });

export function formatBytes(bytes: number, decimals = 2): string {
    if (bytes === 0) return '0 B';

    const k = 1024;
    const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    const value = bytes / Math.pow(k, i);

    return `${parseFloat(value.toFixed(decimals))} ${units[i]}`;
}

export function formatMegabytes(mb: number, decimals = 2): string {
    if (mb === 0) return '0 B';

    const k = 1024;
    const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
    const bytes = mb * k * k;
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    const value = bytes / Math.pow(k, i);

    return `${parseFloat(value.toFixed(decimals))} ${units[i]}`;
}

export function formatTimeLeft(seconds: number): string {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    const parts = [];

    if (hrs > 0) parts.push(`${hrs} hour${hrs !== 1 ? 's' : ''}`);
    if (mins > 0) parts.push(`${mins} minute${mins !== 1 ? 's' : ''}`);
    if (secs > 0 || parts.length === 0) parts.push(`${secs} second${secs !== 1 ? 's' : ''}`);

    return parts.join(', ');
}

export function downloadFile(url: string, fileName?: string): void {
    try {
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = fileName || url.split('/').pop() || 'downloaded-file';
      anchor.style.display = 'none';
  
      document.body.appendChild(anchor);
      anchor.click();
  
      document.body.removeChild(anchor);
    } catch (error) {
      console.error('Arrey baba! Something went wrong while downloading:', error);
    }
  }
  