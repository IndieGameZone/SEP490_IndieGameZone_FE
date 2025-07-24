import { Button } from "antd";
import { useState, useRef, useEffect, ReactNode } from "react";

type ExpandableWrapperProps = {
  children: ReactNode;
  maxHeight?: number;
  variant?: "button" | "text";
  expanded?: boolean; 
  onToggle?: (expanded: boolean) => void;
};

const ExpandableWrapper = ({
  children,
  maxHeight = 200,
  variant = "button",
  expanded,
  onToggle,
}: ExpandableWrapperProps) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [internalExpanded, setInternalExpanded] = useState(false);
  const isControlled = expanded !== undefined;
  const isExpanded = isControlled ? expanded : internalExpanded;
  const [isOverflowing, setIsOverflowing] = useState(false);

  useEffect(() => {
    if (contentRef.current) {
      setIsOverflowing(contentRef.current.scrollHeight > maxHeight);
    }
  }, [children, maxHeight]);

  const toggleExpanded = () => {
    const newValue = !isExpanded;

    if (isControlled) {
      onToggle?.(newValue); 
    } else {
      setInternalExpanded(newValue);
      onToggle?.(newValue); 
    }
  };

  return (
    <div>
      <div
        ref={contentRef}
        aria-expanded={isExpanded}
        style={{
          maxHeight: isExpanded ? "none" : `${maxHeight}px`,
          overflow: "hidden",
          transition: "max-height 0.3s ease",
        }}
      >
        {children}
      </div>

      {isOverflowing && (
        <div className={`${variant == "button" ? "text-center  mt-2" : ""}`}>
          {variant === "button" ? (
            <Button
              onClick={toggleExpanded}
              type="text"
              style={{ fontWeight: "bold" }}
            >
              --- {isExpanded ? "Show Less" : "Show More"} ---
            </Button>
          ) : (
            <span
              onClick={toggleExpanded}
              className="cursor-pointer text-zinc-500 hover:underline font-semibold"
            >
              {isExpanded ? "Show less" : "Show more"}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default ExpandableWrapper;
