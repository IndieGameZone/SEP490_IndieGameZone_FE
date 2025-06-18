import { useEffect, useState } from "react";

function useDebounce<T>(value: T, delay: number): { debouncedValue: T; isDebouncing: boolean } {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  const [isDebouncing, setIsDebouncing] = useState(false);

  useEffect(() => {
    setIsDebouncing(true); 
    const handler = setTimeout(() => {
      setDebouncedValue(value);
      setIsDebouncing(false); 
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return { debouncedValue, isDebouncing };
}

export default useDebounce;