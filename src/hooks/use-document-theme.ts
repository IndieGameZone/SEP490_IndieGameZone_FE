import { useEffect, useState } from 'react';

function useDocumentTheme() {
    const [theme, setTheme] = useState(() =>
        document.documentElement.getAttribute('data-theme') || 'light'
    );

    useEffect(() => {
        const observer = new MutationObserver(() => {
            const newTheme = document.documentElement.getAttribute('data-theme');
            setTheme(newTheme || 'light');
        });

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['data-theme'],
        });

        return () => observer.disconnect();
    }, []);

    return theme;
}

export default useDocumentTheme;