import { useEffect, useRef } from "react";

function useRenderCount() {
    const count = useRef(1);
    useEffect(() => {
        count.current += 1;
        console.log(`Rendered ${count.current} times!`);
    });
    return count.current;
}

export default useRenderCount;
