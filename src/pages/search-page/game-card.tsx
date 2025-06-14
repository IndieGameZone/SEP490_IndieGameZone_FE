import { FaStar, FaWindows } from "react-icons/fa";
import devAvatar from "@/assets/mock/dev-avatar.webp";
import gameCoverImage from "@/assets/mock/game-1-cover-image.webp";
import { Link } from "react-router-dom";

const GameCard = () => {
  return (
    <div className="bg-zinc-900 rounded-lg shadow-lg transform border highlight-hover overflow-hidden">
      <Link to={`/game/1`}>
        <img
          src={gameCoverImage}
          alt={"game cover image"}
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
            <Link to={`/game/1`}>
              <h3 className="font-bold text-lg truncate">Time to Morp</h3>
            </Link>
            <Link to={`/profile/1`}>
              <p className="text-sm">Team HalfBeard</p>
            </Link>
            <p className="text-xs leading-relaxed text-zinc-500 flex gap-1">
              <Link to={`/search?tag=1`}>#Base Building</Link>
              <Link to={`/search?tag=1`}>#3D</Link>
              <Link to={`/search?tag=1`}>#Offline</Link>
            </p>
            <div className="flex items-center justify-between pt-2">
              <Link to={`/search?platform=1`} className="flex items-center gap-2">
                <FaWindows size={20} />
              </Link>
              <div className="flex items-center gap-2">
                <span>4.5</span>
                <FaStar />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameCard;
