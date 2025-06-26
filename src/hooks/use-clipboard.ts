import { useState } from "react";

export function useClipboard() {
  const [isCopied, setIsCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const copyToClipboard = async (text: string): Promise<boolean> => {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      setError(null);

      // Reset state after a delay
      setTimeout(() => setIsCopied(false), 2000);
      return true;
    } catch (err) {
      setIsCopied(false);
      setError("Failed to copy");
      return false;
    }
  };

  return { isCopied, error, copyToClipboard };
}
