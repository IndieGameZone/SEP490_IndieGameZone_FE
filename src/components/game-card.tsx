import { useNavigate } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import FaultTolerantImage from "@/components/fault-tolerant-image";
import { formatCurrencyVND } from "@/lib/currency";
import { Badge, Tag } from "antd";
import { Game } from "@/types/game";
import AddToWishlistButton from "@/components/buttons/add-to-wishlist-button";
import ConditionalWrapper from "@/components/wrappers/conditional-wrapper";
import { useMemo } from "react";

interface GameCardProps {
  game: Game;
  variant?: "masonry" | "default";
}
const GameCard = ({ game, variant = "default" }: GameCardProps) => {
  const navigate = useNavigate();

  const {
    coverImage,
    name,
    category,
    price,
    numberOfReviews,
    averageRating,
    shortDescription,
    gameTags,
    hasCommercial,
    discount,
  } = game;

  const handleClickCard = () => navigate(`/game/${game.id}`);
  
  const priceAfterDiscount = useMemo(
    () => game.price * (1 - game.discount / 100),
    [game]
  );
  if (!game) {
    return (
      <div className="bg-zinc-900 rounded-lg p-4 text-center text-gray-500">
        Game data unavailable
      </div>
    );
  }

  return (
    <ConditionalWrapper
      condition={hasCommercial}
      wrapper={(children) => (
        <Badge.Ribbon text="Sponsored" placement="start">
          <div className="p-[2px] rounded bg-gradient-to-r hover:from-pink-500 hover:via-red-500 hover:to-yellow-500 bg-transparent transition-colors duration-300">
            {children}
          </div>
        </Badge.Ribbon>
      )}
    >
      <div
        className={`rounded shadow-lg overflow-hidden bg-zinc-900 ${
          hasCommercial ? "" : "highlight-hover"
        }`}
      >
        <div className="relative">
          <FaultTolerantImage
            src={coverImage}
            alt={`${name} cover image`}
            className={`w-full object-contain cursor-pointer bg-zinc-950 ${
              variant == "default" ? "aspect-video" : "max-h-64"
            }`}
            onClick={handleClickCard}
          />
          <div className="absolute top-2 right-2">
            <AddToWishlistButton game={game} />
          </div>
        </div>
        <div className="p-3">
          <div className="flex justify-between">
            <div>
              <h3
                className="font-bold text-lg truncate cursor-pointer"
                onClick={handleClickCard}
              >
                {name}
              </h3>
              <a href={`/search?category=${category?.id}`}>
                <p className="text-xs hover:underline">{category?.name}</p>
              </a>
            </div>
            <div>
              <p className="font-semibold text-green-500 text-right">
                {discount > 0 && (
                  <>
                    <span className="text-zinc-400 line-through text-sm">
                      {formatCurrencyVND(price)}
                    </span>{" "}
                  </>
                )}
                {priceAfterDiscount === 0
                  ? "Free"
                  : formatCurrencyVND(priceAfterDiscount)}
              </p>
              {numberOfReviews > 0 ? (
                <div className="flex items-center justify-end gap-1">
                  <span>{averageRating.toFixed(1)}</span>
                  <FaStar className="text-yellow-400 text-xs"/>
                </div>
              ) : (
                <p className="text-zinc-400 text-xs text-end">No rating</p>
              )}
            </div>
          </div>
          <p
            className={`py-1 text-sm text-zinc-500 ${
              variant == "default" ? "line-clamp-2" : ""
            }`}
          >
            {shortDescription}
          </p>
          <div className="flex items-center mt-1">
            {gameTags?.slice(0, 3).map((tag) => (
              <a href={`/search?tags=${tag.tag.id}`} key={tag.tag.id}>
                <Tag color="orange">{tag.tag.name}</Tag>
              </a>
            ))}
            {gameTags && gameTags.length > 3 && (
              <Tag color="orange">+{gameTags.length - 3} more</Tag>
            )}
          </div>
        </div>
      </div>
    </ConditionalWrapper>
  );
};

export default GameCard;
