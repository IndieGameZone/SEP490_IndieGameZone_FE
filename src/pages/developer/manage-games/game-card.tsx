import FaultTolerantImage from "@/components/fault-tolerant-image";
import { Game } from "@/types/game";
import { Link } from "react-router-dom";

const GameCard = ({ game }: { game: Game }) => {
  return (
    <Link to={`/dev/game/${game.id}`}>
      <div className="bg-zinc-800 rounded overflow-hidden highlight-hover">
        <FaultTolerantImage src={game.coverImage} alt="" className="aspect-4/3 object-cover" />
        <div className="p-2">
          <p className="font-semibold">{game.name}</p>
        </div>
      </div>
    </Link>
  );
};

export default GameCard;
