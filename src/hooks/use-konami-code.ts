import { useEffect, useState } from 'react';

const KONAMI_SEQUENCE = [
  'ArrowUp', 'ArrowUp',
  'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight',
  'ArrowLeft', 'ArrowRight',
  'b', 'a',
];

export function useKonamiCode(callback: () => void) {
  const [_, setInput] = useState<string[]>([]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setInput(prev => {
        const newInput = [...prev, e.key].slice(-KONAMI_SEQUENCE.length);
        if (newInput.join('') === KONAMI_SEQUENCE.join('')) {
          callback();
        }
        return newInput;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [callback]);
}
