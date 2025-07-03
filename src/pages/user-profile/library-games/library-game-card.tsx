import React from "react";
import { useNavigate } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import { Tag } from "antd";
import FaultTolerantImage from "@/components/fault-tolerant-image";
import { formatCurrencyVND } from "@/lib/currency";
import { LibraryItem } from "@/types/game";

interface LibraryGameCardProps {
  item: LibraryItem;
}

const LibraryGameCard: React.FC<LibraryGameCardProps> = ({ item }) => {
  const navigate = useNavigate();
  const handleClickCard = () => navigate(`/game/${item.game.id}`);

  if (!item.game || !item.game.id) {
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
          src={item.game.coverImage}
          alt={`${item.game.name} cover image`}
          className="w-full h-48 object-cover cursor-pointer"
          onClick={handleClickCard}
        />
      </div>
      <div className="p-3">
        <div className="flex justify-between">
          <div>
            <h3
              className="font-bold text-lg truncate cursor-pointer"
              onClick={handleClickCard}
            >
              {item.game.name}
            </h3>
            <p className="text-xs">{item.game.category}</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-green-500">
              {item.game.price === 0
                ? "Free"
                : formatCurrencyVND(item.game.price)}
            </p>
            {item.game.numberOfReviews > 0 ? (
              <div className="flex items-center justify-end gap-2">
                <span>{item.game.averageRating}</span>
                <FaStar />
              </div>
            ) : (
              <p className="text-zinc-400 text-xs text-end">No rating</p>
            )}
          </div>
        </div>
        <div className="flex items-center mt-1">
          {item.game.tags?.slice(0, 3).map((tag, index) => (
            <Tag color="orange" key={`library-item-${index}`}>
              {tag}
            </Tag>
          ))}
          {item.game.tags && item.game.tags.length > 3 && (
            <Tag color="orange">+{item.game.tags.length - 3} more</Tag>
          )}
        </div>
      </div>
    </div>
  );
};

export default LibraryGameCard;
