import React from "react";
import { useNavigate } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import { Tag } from "antd";
import FaultTolerantImage from "@/components/fault-tolerant-image";
import { formatCurrencyVND } from "@/lib/currency";
import { Game, WishlistItem } from "@/types/game";
import AddToWishlistButton from "@/components/buttons/add-to-wishlist-button";

interface WishlistGameCardProps {
  game: WishlistItem;
}

const WishlistGameCard: React.FC<WishlistGameCardProps> = ({ game }) => {
  const navigate = useNavigate();
  const handleClickCard = () => navigate(`/game/${game.game.id}`);

  if (!game || !game.game.id) {
    return <div className="bg-zinc-900 rounded-lg p-4 text-center text-gray-500">Game data unavailable</div>;
  }

  return (
    <div className="bg-zinc-900 rounded-lg shadow-lg border highlight-hover overflow-hidden">
      <div className="relative">
        <FaultTolerantImage
          src={game.game.coverImage}
          alt={`${game.game.name} cover image`}
          className="w-full h-48 object-contain cursor-pointer bg-zinc-950"
          onClick={handleClickCard}
        />
        <div className="absolute top-2 right-2">
          <AddToWishlistButton
            game={
              {
                id: game.game.id,
                name: game.game.name,
                coverImage: game.game.coverImage,
                price: game.game.price,
              } as Game
            }
          />
        </div>
      </div>
      <div className="p-3">
        <div className="flex justify-between">
          <div>
            <h3 className="font-bold text-lg cursor-pointer" onClick={handleClickCard}>
              {game.game.name}
            </h3>
            <p className="text-xs hover:underline">{game.game.category}</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-green-500">
              {game.game.price === 0 ? "Free" : formatCurrencyVND(game.game.price)}
            </p>
            {game.game.numberOfReviews > 0 ? (
              <div className="flex items-center justify-end gap-1">
                <span>{game.game.averageRating.toFixed(1)}</span>
                <FaStar className="text-yellow-400 text-xs" />
              </div>
            ) : (
              <p className="text-zinc-400 text-xs text-end">No rating</p>
            )}
          </div>
        </div>
        <p className="py-1 text-sm text-zinc-500">{game.game.shortDescription}</p>
        <div className="flex items-center mt-1">
          {game.game.tags?.slice(0, 3).map((tag, index) => (
            <Tag color="orange" key={index}>
              {tag}
            </Tag>
          ))}
          {game.game.tags && game.game.tags.length > 3 && <Tag color="orange">+{game.game.tags.length - 3} more</Tag>}
        </div>
      </div>
    </div>
  );
};

export default WishlistGameCard;
