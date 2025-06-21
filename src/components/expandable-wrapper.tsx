import { Button } from "antd";
import { useState, useRef, useEffect, ReactNode } from "react";

const ExpandableWrapper = ({
  children,
  maxHeight = 200,
}: {
  children: ReactNode;
  maxHeight?: number;
}) => {
  const contentRef = useRef<any>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);

  useEffect(() => {
    if (contentRef.current.scrollHeight > maxHeight) {
      setIsOverflowing(true);
    }
  }, [children, maxHeight]);

  return (
    <div>
      <div
        ref={contentRef}
        style={{
          maxHeight: isExpanded ? "none" : `${maxHeight}px`,
          overflow: "hidden",
          transition: "max-height 0.3s ease",
        }}
      >
        {children}
      </div>

      {isOverflowing && (
        <div className="text-center">
          <Button onClick={() => setIsExpanded((prev) => !prev)} type="text" style={{fontWeight: "bold"}}>
            --- {isExpanded ? "Show Less" : "Show More"} ---
          </Button>
        </div>
      )}
    </div>
  );
};

export default ExpandableWrapper;
