import React, { useEffect, useRef } from "react";
import lottie, { AnimationItem } from "lottie-web/build/player/lottie_light";

interface LottiePlayerProps {
  animationData: object;
  loop?: boolean;
  autoplay?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

const LottiePlayer: React.FC<LottiePlayerProps> = ({
  animationData,
  loop = true,
  autoplay = true,
  style,
  className = "",
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const animationRef = useRef<AnimationItem | null>(null);

  useEffect(() => {
    if (containerRef.current) {
      animationRef.current = lottie.loadAnimation({
        container: containerRef.current,
        renderer: "svg",
        loop,
        autoplay,
        animationData,
      });
    }

    return () => {
      animationRef.current?.destroy();
    };
  }, [animationData, loop, autoplay]);

  return <div ref={containerRef} style={style} className={className} />;
};

export default LottiePlayer;
