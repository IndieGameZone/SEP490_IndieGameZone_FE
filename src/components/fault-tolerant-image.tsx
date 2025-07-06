import { useState } from "react";
import imagePlaceholder from "@/assets/image_placeholder.svg"

const FaultTolerantImage = ({
  src,
  alt,
  fallback = imagePlaceholder,
  className,
  onClick,
}: {
  src: string;
  alt?: string;
  fallback?: string;
  className?: string;
  onClick?: () => void;
}) => {
  const [imageSrc, setImageSrc] = useState(src);
  const handleError = () => {
    setImageSrc(fallback);
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
