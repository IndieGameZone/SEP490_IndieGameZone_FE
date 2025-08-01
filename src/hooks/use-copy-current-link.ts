import { useGlobalMessage } from '@/components/message-provider';
import { useCallback, useState } from 'react';
import { useLocation } from 'react-router-dom';

type Params = Record<string, string | number | boolean | undefined>;

export const useCopyCurrentLink = () => {
    const location = useLocation();
    const [copied, setCopied] = useState(false);
    const messageApi = useGlobalMessage();

    const generateUrl = useCallback((customParams?: Params) => {
        const baseUrl = `${window.location.origin}${location.pathname}`;
        const url = new URL(baseUrl);

        if (customParams) {
            Object.entries(customParams).forEach(([key, value]) => {
                if (value !== undefined) url.searchParams.set(key, String(value));
            });
        } else {
            const searchParams = new URLSearchParams(location.search);
            searchParams.forEach((value, key) => {
                url.searchParams.set(key, value);
            });
        }

        if (location.hash) {
            url.hash = location.hash;
        }

        return url.toString();
    }, [location]);

    const copyLink = useCallback((params?: Params) => {
        const fullUrl = generateUrl(params);
        navigator.clipboard.writeText(fullUrl)
            .then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
                messageApi.success("Copy link successfully!");
            })
            .catch(() => {
                messageApi.error("Failed to copy link!");
            });
    }, [generateUrl]);

    return { copyLink, copied, generateUrl };
};
