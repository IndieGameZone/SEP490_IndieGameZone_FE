import { useState } from "react";
import imagePlaceholder from "@/assets/image_placeholder.svg";
import imagePlaceholderLight from "@/assets/image_placeholder_light.svg";

const FaultTolerantImage = ({
  src,
  alt,
  fallback,
  className,
  onClick,
  darkTheme = true,
}: {
  src: string;
  alt?: string;
  fallback?: string;
  className?: string;
  darkTheme?: boolean;
  onClick?: () => void;
}) => {
  const [imageSrc, setImageSrc] = useState(src);
  const handleError = () => {
    setImageSrc(
      fallback ?? darkTheme ? imagePlaceholder : imagePlaceholderLight
    );
  };
  return (
    <img
      src={imageSrc}
      alt={alt}
      onError={handleError}
      className={className}
      onClick={onClick}
    />
  );
};

export default FaultTolerantImage;
