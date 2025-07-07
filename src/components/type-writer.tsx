import { useState, useEffect } from "react";

const TypeWriter = ({
  text,
  speed = 50,
  delay = 0,
  cursor = true,
  cursorChar = "|",
  onComplete = () => {},
  className = "",
  loop = false,
  pauseTime = 2000,
}: {
  text: string;
  speed?: number;
  delay?: number;
  cursor?: boolean;
  cursorChar?: string;
  onComplete?: () => void;
  className?: string;
  pauseTime?: number;
  loop?: boolean;
}) => {
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    if (delay > 0) {
      const delayTimer = setTimeout(() => {
        startTyping();
      }, delay);
      return () => clearTimeout(delayTimer);
    } else {
      startTyping();
    }
  }, [text, delay]);

  const startTyping = () => {
    setDisplayText("");
    setCurrentIndex(0);
    setIsComplete(false);
  };

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayText((prev) => prev + text[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, speed);
      return () => clearTimeout(timer);
    } else if (currentIndex === text.length && !isComplete) {
      setIsComplete(true);
      onComplete();

      if (loop) {
        setTimeout(() => {
          startTyping();
        }, pauseTime);
      }
    }
  }, [currentIndex, text, speed, isComplete, loop, pauseTime, onComplete]);

  // Cursor blinking effect
  useEffect(() => {
    if (cursor) {
      const cursorTimer = setInterval(() => {
        setShowCursor((prev) => !prev);
      }, 500);
      return () => clearInterval(cursorTimer);
    }
  }, [cursor]);

  return (
    <span className={className}>
      {displayText}
      {cursor && (
        <span
          className={`inline-block ${showCursor ? "opacity-100" : "opacity-0"}`}
          style={{ transition: "opacity 0.1s" }}
        >
          {cursorChar}
        </span>
      )}
    </span>
  );
};

export default TypeWriter;
