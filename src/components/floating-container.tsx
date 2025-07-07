import React from "react";
import { cn } from "@/lib/utils"; // Optional: Tailwind merge utility

type FloatingContainerProps = {
  items: React.ReactNode[];
  className?: string;
};

const FloatingContainer: React.FC<FloatingContainerProps> = ({ items, className }) => {
  return (
    <div className={cn("relative w-full h-full overflow-hidden", className)}>
      {items.map((item, index) => (
        <div
          key={index}
          className={`absolute animate-floating duration-1000`}
          style={{
            left: `${Math.random() * 50}%`,
            top: `${Math.random() * 70}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${6 + Math.random() * 4}s`,
          }}
        >
          {item}
        </div>
      ))}
    </div>
  );
};

export default FloatingContainer;
