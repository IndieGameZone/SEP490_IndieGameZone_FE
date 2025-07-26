import { useEffect, useState } from 'react';

export function useHashState(defaultValue: string): [string, (value: string) => void] {
    const getHash = () => {
        const hash = window.location.hash.slice(1);
        return hash || defaultValue;
    };

    const [value, setValue] = useState(getHash);

    useEffect(() => {
        const onHashChange = () => {
            setValue(getHash());
        };

        window.addEventListener('hashchange', onHashChange);
        return () => window.removeEventListener('hashchange', onHashChange);
    }, []);

    const updateHash = (newValue: string) => {
        window.location.hash = newValue;
        setValue(newValue);
    };

    return [value, updateHash];
}
