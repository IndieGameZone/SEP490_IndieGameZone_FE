import { formatCurrencyVND } from "@/lib/currency";
import { Game } from "@/types/game";
import { Tag } from "antd";
import { FaStar } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import FaultTolerantImage from "@/components/fault-tolerant-image";

const GameCard = ({ game }: { game: Game }) => {
  const navigate = useNavigate();

  if (!game || !game.id) {
    return (
      <div className="bg-zinc-900 rounded-lg p-4 text-center text-gray-500">
        Game data unavailable
      </div>
    );
  }

  const rating = 4.5;
  const handleClickCard = () => {
    navigate(`/game/${game.id}`);
  };

  return (
    <div className="bg-zinc-900 rounded-lg shadow-lg border highlight-hover overflow-hidden">
      <FaultTolerantImage
        src={game.coverImage}
        alt={`${game.name} cover image`}
        className="w-full h-48 object-cover cursor-pointer"
        onClick={handleClickCard}
      />

      <div className="p-3">
        <div className="flex-1">
          <div className="flex justify-between">
            <div>
              <h3 className="font-bold text-lg truncate cursor-pointer" onClick={handleClickCard}>{game.name}</h3>
              <Link to={`/search?category=${game.category?.id}`}>
                <p className="text-xs hover:underline">{game.category?.name}</p>
              </Link>
            </div>
            <div>
              <p className="text-sm font-semibold text-green-500">
                {game.price == 0 ? "Free" : formatCurrencyVND(game.price)}
              </p>
              <div className="flex items-center gap-2">
                <span>{rating}</span>
                <FaStar />
              </div>
            </div>
          </div>
          <p className="py-1 text-sm text-zinc-500">{game.shortDescription}</p>
          <div className="flex items-center mt-1">
            {game.gameTags?.slice(0, 3).map((tag, index: number) => (
              <Link to={`/search?tag=${tag.tag.id}`} key={`game-tag-${index}`}>
                <Tag key={index} color="orange">
                  {tag.tag.name}
                </Tag>
              </Link>
            ))}
            {game.gameTags && game.gameTags.length > 3 && (
              <Tag color="orange">+{game.gameTags.length - 3} more</Tag>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameCard;
