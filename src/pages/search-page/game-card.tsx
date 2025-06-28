import useAuthStore from '@/store/use-auth-store';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { FaHeart, FaRegHeart, FaStar } from 'react-icons/fa';
import FaultTolerantImage from '@/components/fault-tolerant-image';
import { formatCurrencyVND } from '@/lib/currency';
import { Tag, message } from 'antd';
import { Game } from '@/types/game';
import useWishlistStore from '@/store/use-wish-list-store';

const GameCard = ({ game }: { game: Game }) => {
  const navigate = useNavigate();
  const { profile, fetchProfile } = useAuthStore();
  const { wishlists, fetchWishlists, addToWishlist, removeFromWishlist } = useWishlistStore();
  const isWishlisted = wishlists.includes(game.id);
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    if (profile?.id && game.id) {
      fetchProfile();
      fetchWishlists(profile.id);
    }
  }, [profile?.id, game.id, fetchProfile, fetchWishlists]);

  const handleClickCard = () => navigate(`/game/${game.id}`);

  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!profile?.id) {
      messageApi.open({
        type: 'error',
        content: 'Please log in to manage your wishlist',
      });
      return;
    }
    try {
      if (!isWishlisted) {
        await addToWishlist(profile.id, game.id);
        messageApi.open({
          type: 'success',
          content: `"${game.name}" added to wishlist`,
        });
      } else {
        await removeFromWishlist(profile.id, game.id);
        messageApi.open({
          type: 'success',
          content: `"${game.name}" removed from wishlist`,
        });
      }
    } catch (error) {
      messageApi.open({
        type: 'error',
        content: `Failed to update wishlist for "${game.name}"`,
      });
    }
  };

  if (!game || !game.id) {
    return (
      <div className="bg-zinc-900 rounded-lg p-4 text-center text-gray-500">
        Game data unavailable
      </div>
    );
  }

  const rating = 4.5;

  return (
    <>
      {contextHolder}
      <div className="bg-zinc-900 rounded-lg shadow-lg border highlight-hover overflow-hidden">
        <div className="relative">
          <FaultTolerantImage
            src={game.coverImage}
            alt={`${game.name} cover image`}
            className="w-full h-48 object-cover cursor-pointer"
            onClick={handleClickCard}
          />
          <button
            onClick={handleWishlistToggle}
            className="absolute top-2 right-2 p-2 bg-black bg-opacity-50 rounded-full hover:bg-opacity-70"
          >
            {isWishlisted ? <FaHeart className="text-red-500 text-lg" /> : <FaRegHeart className="text-white text-lg" />}
          </button>
        </div>
        <div className="p-3">
          <div className="flex justify-between">
            <div>
              <h3 className="font-bold text-lg truncate" onClick={handleClickCard}>
                {game.name}
              </h3>
              <a href={`/search?category=${game.category?.id}`}>
                <p className="text-xs hover:underline">{game.category?.name}</p>
              </a>
            </div>
            <div>
              <p className="text-sm font-semibold text-green-500">
                {game.price === 0 ? 'Free' : formatCurrencyVND(game.price)}
              </p>
              <div className="flex items-center gap-2">
                <span>{rating}</span>
                <FaStar />
              </div>
            </div>
          </div>
          <p className="py-1 text-sm text-zinc-500">{game.shortDescription}</p>
          <div className="flex items-center mt-1">
            {game.gameTags?.slice(0, 3).map((tag, index) => (
              <a href={`/search?tag=${tag.tag.id}`} key={index}>
                <Tag color="orange">{tag.tag.name}</Tag>
              </a>
            ))}
            {game.gameTags && game.gameTags.length > 3 && <Tag color="orange">+{game.gameTags.length - 3} more</Tag>}
          </div>
        </div>
      </div>
    </>
  );
};

export default GameCard;