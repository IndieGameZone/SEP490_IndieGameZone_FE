import { useState, useCallback } from 'react';

export function useRerender() {
    const [renderKey, setRenderKey] = useState(0)

    const rerender = useCallback(() => {
        setRenderKey((key) => key + 1);
    }, []);

    return { renderKey, rerender };
}
