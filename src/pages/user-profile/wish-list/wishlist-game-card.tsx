import React from "react";
import { useNavigate } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import { Tag } from "antd";
import FaultTolerantImage from "@/components/fault-tolerant-image";
import { formatCurrencyVND } from "@/lib/currency";
import { Game } from "@/types/game";
import AddToWishlistButton from "@/components/add-to-wishlist-button";

interface WishlistGameCardProps {
  game: Game;
}

const WishlistGameCard: React.FC<WishlistGameCardProps> = ({ game }) => {
  const navigate = useNavigate();
  const handleClickCard = () => navigate(`/game/${game.id}`);

  if (!game || !game.id) {
    return (
      <div className="bg-zinc-900 rounded-lg p-4 text-center text-gray-500">
        Game data unavailable
      </div>
    );
  }

  return (
    <div className="bg-zinc-900 rounded-lg shadow-lg border highlight-hover overflow-hidden">
      <div className="relative">
        <FaultTolerantImage
          src={game.coverImage}
          alt={`${game.name} cover image`}
          className="w-full h-48 object-cover cursor-pointer"
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
              {game.name}
            </h3>
            <a href={`/search?category=${game.category?.id}`}>
              <p className="text-xs hover:underline">{game.category?.name}</p>
            </a>
          </div>
          <div>
            <p className="text-sm font-semibold text-green-500">
              {game.price === 0 ? "Free" : formatCurrencyVND(game.price)}
            </p>
            {game.numberOfReviews > 0 ? (
              <div className="flex items-center justify-end gap-2">
                <span>{game.averageRating}</span>
                <FaStar />
              </div>
            ) : (
              <p className="text-zinc-400 text-xs text-end">No rating</p>
            )}
          </div>
        </div>
        <p className="py-1 text-sm text-zinc-500">{game.shortDescription}</p>
        <div className="flex items-center mt-1">
          {game.gameTags?.slice(0, 3).map((tag, index) => (
            <a href={`/search?tag=${tag.tag.id}`} key={index}>
              <Tag color="orange">{tag.tag.name}</Tag>
            </a>
          ))}
          {game.gameTags && game.gameTags.length > 3 && (
            <Tag color="orange">+{game.gameTags.length - 3} more</Tag>
          )}
        </div>
      </div>
    </div>
  );
};

export default WishlistGameCard;
