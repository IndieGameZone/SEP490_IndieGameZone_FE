import { CategoryTag } from "@/components/status-tags";
import useAuthStore from "@/store/use-auth-store";
import { Game } from "@/types/game";
import { Image, Rate, Tag, Typography } from "antd";
import { Link } from "react-router-dom";
const { Text, Title } = Typography;

interface GameInfoProps {
  game: Game;
  simple?: boolean;
}
const GameInfo = ({ game, simple = false }: GameInfoProps) => {
  const { profile } = useAuthStore();
  return (
    <div className="grid grid-cols-4 gap-4">
      <div className="flex flex-col gap-1 items-center">
        <Image
          src={game.coverImage}
          alt={game.name}
          className="rounded object-contain shadow-sm aspect-video bg-zinc-200"
          fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FuCCSlkwkGCM7sLOzgUJSFthFdm/ZjaNkdXa3aBwmY+g3rBp7hl51T0+n6s39nmAk1C"
        />
        {!simple && <CategoryTag category={game.category} />}
      </div>

      <div className="col-span-3 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <Link to={`/${profile?.role.name.toLowerCase()}/game/${game.id}`}>
            <Title level={5} className="!mb-0 truncate" title={game.name}>
              {game.name}
            </Title>
          </Link>
        </div>
        <div className="flex items-center gap-2 text-gray-600 text-sm mb-2">
          <Text
            type="secondary"
            className="truncate"
            title={game.shortDescription}
          >
            {game.shortDescription || "No description available"}
          </Text>
        </div>
        {!simple && (
          <>
            <div className="flex items-center gap-2">
              <Rate
                disabled
                defaultValue={game.averageRating || 0}
                className="text-xs"
              />
              <Text type="secondary" className="text-xs">
                {(game.averageRating || 0).toFixed(1)} (
                {game.numberOfReviews || 0} reviews)
              </Text>
            </div>
            <div className="flex flex-wrap gap-1 mt-2">
              {(game.gameTags || []).slice(0, 3).map((gameTag, index) => (
                <Tag key={gameTag?.tag?.id || index} className="text-xs">
                  {gameTag?.tag?.name || "Unknown"}
                </Tag>
              ))}
              {(game.gameTags || []).length > 3 && (
                <Tag className="text-xs">
                  +{(game.gameTags || []).length - 3} more
                </Tag>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default GameInfo;
