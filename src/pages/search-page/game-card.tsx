import { Tag } from "antd";
import { FaStar } from "react-icons/fa";

interface GameCardProps {
  game?: {
    id?: string;
    name?: string;
    coverImage?: string;
    shortDescription?: string;
    gameTags?: { tag: { name: string } }[];
    price?: number;
    priceAfterDiscount?: number;
    category?: { name?: string };
  };
}

const GameCard = ({ game }: GameCardProps) => {
  if (!game || !game.id) {
    return (
      <div className="bg-zinc-900 rounded-lg p-4 text-center text-gray-500">
        Game data unavailable
      </div>
    );
  }

  const rating = 4.5;

  const displayPrice =
    game.priceAfterDiscount === 0
      ? "Free"
      : `$${game.priceAfterDiscount || game.price || 0}`;

  return (
    <div className="bg-zinc-900 rounded-lg shadow-lg transform border highlight-hover overflow-hidden">
      <div>
        <img
          src={game.coverImage || "https://via.placeholder.com/300x150"}
          alt={`${game.name} cover image`}
          className="w-full h-48 object-cover"
        />
      </div>

      <div className="p-3">
        <div className="flex-1">
          <div className="flex justify-between">
            <div>
              <h3 className="font-bold text-lg truncate">
                {game.name || "Unnamed Game"}
              </h3>
              <p className="text-xs">{game.category?.name}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-green-500">
                {displayPrice}
              </p>
              <div className="flex items-center gap-2">
                <span>{rating}</span>
                <FaStar />
              </div>
            </div>
          </div>
          <p className="py-1 text-sm text-zinc-500">{game.shortDescription}</p>
          <div className="flex items-center mt-1">
            {game.gameTags?.map((tag, index) => (
              <Tag key={index} color="orange">
                {tag.tag.name}
              </Tag>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameCard;
