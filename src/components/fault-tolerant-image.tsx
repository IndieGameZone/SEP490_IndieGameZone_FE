import { useState, useEffect } from "react";
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
  const getFallback = () =>
    fallback ?? (darkTheme ? imagePlaceholder : imagePlaceholderLight);

  const [imageSrc, setImageSrc] = useState(
    src && src.trim() !== "" ? src : getFallback()
  );

  const handleError = () => {
    setImageSrc(getFallback());
  };

  useEffect(() => {
    if (!src || src.trim() === "") {
      setImageSrc(getFallback());
    } else {
      setImageSrc(src);
    }
  }, [src]);

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
