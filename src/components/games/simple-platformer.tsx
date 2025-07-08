import { useEffect, useRef, useState } from 'react';

const GRAVITY = 0.5;
const JUMP_STRENGTH = -10;
const GROUND_Y = 300;

export default function SimplePlatformer() {
  const [player, setPlayer] = useState({ x: 50, y: GROUND_Y, vy: 0 });
  const [keys, setKeys] = useState({ left: false, right: false, up: false });
  const requestRef = useRef<number>(null);

  const keysRef = useRef(keys);
  keysRef.current = keys;

  const updateGame = () => {
    setPlayer((prev) => {
      let { x, y, vy } = prev;
      const keys = keysRef.current;

      if (keys.left) x -= 5;
      if (keys.right) x += 5;

      if (keys.up && y >= GROUND_Y) {
        vy = JUMP_STRENGTH;
      }

      vy += GRAVITY;
      y += vy;

      if (y > GROUND_Y) {
        y = GROUND_Y;
        vy = 0;
      }

      return { x, y, vy };
    });

    requestRef.current = requestAnimationFrame(updateGame);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') setKeys((k) => ({ ...k, left: true }));
      if (e.key === 'ArrowRight') setKeys((k) => ({ ...k, right: true }));
      if (e.key === ' ' || e.key === 'ArrowUp') setKeys((k) => ({ ...k, up: true }));
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') setKeys((k) => ({ ...k, left: false }));
      if (e.key === 'ArrowRight') setKeys((k) => ({ ...k, right: false }));
      if (e.key === ' ' || e.key === 'ArrowUp') setKeys((k) => ({ ...k, up: false }));
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    requestRef.current = requestAnimationFrame(updateGame);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  return (
    <div
      style={{
        position: 'relative',
        width: '600px',
        height: '400px',
        background: '#d0f0ff',
        border: '2px solid #333',
        overflow: 'hidden',
        margin: '20px auto',
      }}
    >
      {/* Ground */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          width: '100%',
          height: '100px',
          background: '#88cc88',
        }}
      />
      {/* Player */}
      <div
        style={{
          position: 'absolute',
          left: player.x,
          top: player.y,
          width: '40px',
          height: '40px',
          background: '#ff6699',
          borderRadius: '10px',
        }}
      />
    </div>
  );
}
