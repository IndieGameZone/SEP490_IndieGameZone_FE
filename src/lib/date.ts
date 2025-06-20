export function formatDate(date: Date): string {
    const options: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "long",
        day: "numeric",
    };
    return date.toLocaleDateString("en-EN", options);
}
export function formatDateTime(date: Date): string {
    const options: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    };
    return date.toLocaleDateString("en-EN", options);
}

export function timeAgo(dateInput: Date | string): string {
    const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    const intervals: [number, string][] = [
        [31536000, 'year'],
        [2592000, 'month'],
        [86400, 'day'],
        [3600, 'hour'],
        [60, 'minute'],
        [1, 'second'],
    ];

    for (const [secondsPerUnit, unit] of intervals) {
        const count = Math.floor(seconds / secondsPerUnit);
        if (count >= 1) {
            return `${count} ${unit}${count > 1 ? 's' : ''} ago`;
        }
    }

    return 'a moment ago';
}