import { cn } from "@/lib/utils";
import { CSSProperties, ReactNode } from "react";

const MaxWidthWrapper = ({
  className,
  children,
  style,
}: {
  className?: string;
  children: ReactNode;
  style?: CSSProperties;
}) => {
  return (
    <div
      className={cn(
        "h-full mx-auto w-full max-w-screen-xl px-2 md:px-20",
        className
      )}
      style={style}
    >
      {children}
    </div>
  );
};

export default MaxWidthWrapper;
