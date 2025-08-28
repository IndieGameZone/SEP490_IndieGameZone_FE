import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";

const TypewriterText = ({
  text,
  speed = 300, 
  instant = false,
}: {
  text: string;
  speed?: number;
  instant?: boolean;
}) => {
  const [displayWords, setDisplayWords] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);

  const words = text.split(" ");

  useEffect(() => {
    if (!text) return;
    if (instant) {
      setDisplayWords(words);
      setIsTyping(false);
    } else {
      setDisplayWords([]);
      setCurrentIndex(0);
      setIsTyping(true);
    }
  }, [text, instant]);

  useEffect(() => {
    if (instant) return;
    if (isTyping && currentIndex < words.length) {
      const timeout = setTimeout(() => {
        setDisplayWords((prev) => [...prev, words[currentIndex]]);
        setCurrentIndex((prev) => prev + 1);
      }, speed);
      return () => clearTimeout(timeout);
    } else if (currentIndex >= words.length) {
      setIsTyping(false);
    }
  }, [currentIndex, words, speed, isTyping, instant]);

  return (
    <div className="text-gray-200 transition-opacity duration-700 ease-in">
      <ReactMarkdown
        components={{
          p: ({ node, ...props }) => <p className="mb-2" {...props} />,
          strong: ({ node, ...props }) => (
            <strong className="font-semibold text-white" {...props} />
          ),
          ul: ({ node, ...props }) => (
            <ul className="list-disc pl-6 mb-2" {...props} />
          ),
          ol: ({ node, ...props }) => (
            <ol className="list-decimal pl-6 mb-2" {...props} />
          ),
          li: ({ node, ...props }) => <li className="mb-1" {...props} />,
          h1: ({ node, ...props }) => (
            <h1 className="text-2xl font-bold text-white mb-2" {...props} />
          ),
          h2: ({ node, ...props }) => (
            <h2 className="text-xl font-semibold text-white mb-2" {...props} />
          ),
          h3: ({ node, ...props }) => (
            <h3 className="text-lg font-medium text-white mb-2" {...props} />
          ),
          code: ({
            node,
            inline,
            ...props
          }: {
            node?: any;
            inline?: boolean;
            [key: string]: any;
          }) =>
            inline ? (
              <code
                className="bg-zinc-800 px-1 rounded text-pink-400"
                {...props}
              />
            ) : (
              <pre className="bg-zinc-900 p-3 rounded mb-3 overflow-x-auto">
                <code {...props} />
              </pre>
            ),
        }}
      >
        {displayWords.join(" ")}
      </ReactMarkdown>
    </div>
  );
};

export default TypewriterText;
