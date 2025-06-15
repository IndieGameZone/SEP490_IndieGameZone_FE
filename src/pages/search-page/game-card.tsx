import { Tag } from "antd";
import { FaStar, FaWindows } from "react-icons/fa";
import { Link } from "react-router-dom";

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
    return <div className="bg-zinc-900 rounded-lg p-4 text-center text-gray-500">Game data unavailable</div>;
  }

  const devAvatar = "https://via.placeholder.com/40";
  const rating = 4.5;

  const displayPrice = game.priceAfterDiscount === 0 ? "Free" : `$${game.priceAfterDiscount || game.price || 0}`;

  return (
    <div className="bg-zinc-900 rounded-lg shadow-lg transform border highlight-hover overflow-hidden">
      <Link to={`/game/${game.id}`}>
        <img
          src={game.coverImage || "https://via.placeholder.com/300x150"}
          alt={`${game.name} cover image`}
          className="w-full h-48 object-cover"
        />
      </Link>

      <div className="p-3">
        <div className="flex items-start gap-3">
          <img
            src={devAvatar}
            alt={`developer avatar`}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="flex-1">
            <Link to={`/game/${game.id}`}>
              <h3 className="font-bold text-lg truncate">{game.name || "Unnamed Game"}</h3>
            </Link>
            <Link to={`/profile/1`}>
              <p className="text-sm">Unknown Developer</p>
            </Link>
            <div className="flex justify-between items-center mt-2">
              <div className="flex flex-col gap-1">
                <p className="text-xs leading-relaxed text-zinc-500 flex gap-1 flex-wrap">
                  {game.gameTags && game.gameTags.length > 0 ? (
                    game.gameTags.map((tag, index) => (
                      <Tag key={index} color="geekblue">
                        {tag.tag.name}
                      </Tag>
                    ))
                  ) : (
                    <span>No tags available</span>
                  )}
                </p>
                {game.category && game.category.name && (
                  <p className="text-xs text-gray-400 mt-1.5 font-extrabold"> {game.category.name}</p>
                )}
              </div>
              <div className="flex flex-col items-end gap-1">
                <p className="text-sm font-semibold text-green-500">{displayPrice}</p>
                <div className="flex items-center gap-2">
                  <span>{rating}</span>
                  <FaStar />
                </div>
              </div>
            </div>
            <div className="flex items-center justify-start pt-2">
              <Link to={`/search?platform=1`} className="flex items-center gap-2">
                <FaWindows size={20} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameCard;