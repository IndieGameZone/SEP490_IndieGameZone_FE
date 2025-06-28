import coinImage from "@/assets/igz_coin.png";

interface CoinIconProps {
  size?: string;
  className?: string;
  alt?: string;
}

export const CoinIcon = ({
  size = "size-4",
  className = "",
  alt = "IGZ Coin",
}: CoinIconProps) => {
  return (
    <img src={coinImage} className={`${size} ${className}`.trim()} alt={alt} />
  );
};

export default CoinIcon;
