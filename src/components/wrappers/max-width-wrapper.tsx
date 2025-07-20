import { cn } from "@/lib/utils";
import { CSSProperties, ReactNode, forwardRef } from "react";

export interface MaxWidthWrapperProps {
  className?: string;
  children: ReactNode;
  style?: CSSProperties;
  /** Maximum width variant - defaults to 'xl' */
  maxWidth?: keyof typeof maxWidthVariants;
  /** Padding variant - defaults to 'responsive' */
  padding?: keyof typeof paddingVariants;
  /** Whether to center the content - defaults to true */
  centered?: boolean;
}

const maxWidthVariants = {
  sm: "max-w-screen-sm",
  md: "max-w-screen-md",
  lg: "max-w-screen-lg",
  xl: "max-w-screen-xl",
  "2xl": "max-w-screen-2xl",
  "4xl": "max-w-4xl",
  "6xl": "max-w-6xl",
  full: "max-w-full",
} as const;

const paddingVariants = {
  none: "",
  sm: "px-4",
  md: "px-6 md:px-8",
  lg: "px-8 md:px-12",
  responsive: "px-2 md:px-20",
} as const;

const MaxWidthWrapper = forwardRef<HTMLDivElement, MaxWidthWrapperProps>(
  (
    {
      className,
      children,
      style,
      maxWidth = "xl",
      padding = "responsive",
      centered = true,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          "h-full w-full",
          centered && "mx-auto",
          maxWidthVariants[maxWidth],
          paddingVariants[padding],
          className
        )}
        style={style}
        {...props}
      >
        {children}
      </div>
    );
  }
);

MaxWidthWrapper.displayName = "MaxWidthWrapper";

export default MaxWidthWrapper;
