import ConditionalWrapper from "@/components/wrappers/conditional-wrapper";
import FaultTolerantImage from "@/components/fault-tolerant-image";
import {
  ModerationStatusTag,
  VisibilityStatus,
} from "@/components/status-tags";
import { formatCurrencyVND } from "@/lib/currency";
import { Game } from "@/types/game";
import { Badge } from "antd";
import { FaStar } from "react-icons/fa";
import { Link } from "react-router-dom";
const GameCard = ({ game }: { game: Game }) => {
  return (
    <ConditionalWrapper
      condition={game.hasCommercial}
      wrapper={(children) => (
        <Badge.Ribbon text="Featured" placement="start">
          {children}
        </Badge.Ribbon>
      )}
    >
      <div className="bg-zinc-900 rounded-lg shadow-lg border highlight-hover overflow-hidden">
        <Link to={`/dev/game/${game.id}`}>
          <FaultTolerantImage
            src={game.coverImage}
            alt={`${game.name} cover image`}
            className="w-full aspect-video object-contain"
          />
        </Link>
        <div className="p-3">
          <div className="flex-1">
            <div className="flex justify-between">
              <div>
                <Link to={`/dev/game/${game.id}`}>
                  <h3 className="font-bold text-lg truncate">{game.name}</h3>
                </Link>
                <Link to={`/search?category=${game.category?.id}`}>
                  <p className="text-xs hover:underline">
                    {game.category?.name}
                  </p>
                </Link>
              </div>
              <div>
                <p className="text-sm font-semibold text-green-500 text-right">
                  {game.price == 0 ? "Free" : formatCurrencyVND(game.price)}
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
            <div className="flex justify-between mt-1">
              <VisibilityStatus variant={"Tag"} status={game.visibility} />
              <ModerationStatusTag
                status={game.censorStatus}
                style={{ marginRight: 0 }}
              />
            </div>
          </div>
        </div>
      </div>
    </ConditionalWrapper>
  );
};

export default GameCard;
