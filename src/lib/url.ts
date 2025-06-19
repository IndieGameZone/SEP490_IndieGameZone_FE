// https://www.youtube.com/channel/CHANNEL_ID
// https://www.youtube.com/c/CUSTOM_NAME
// https://www.youtube.com/@handle
// https://youtube.com/user/USERNAME
export function isValidYouTubeChannelUrl(url: string): boolean {
    const regex = /^https?:\/\/(www\.)?youtube\.com\/(channel\/[a-zA-Z0-9_-]+|c\/[a-zA-Z0-9_-]+|@[\w.-]+|user\/[a-zA-Z0-9_-]+)\/?$/;
    return regex.test(url);
}
