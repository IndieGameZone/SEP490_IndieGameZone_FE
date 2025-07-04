import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaHeart } from "react-icons/fa";
import { Spin, Empty, Button } from "antd";
import useAuthStore from "@/store/use-auth-store";
import useWishlistStore from "@/store/use-wish-list-store";
import WishlistGameCard from "./wishlist-game-card";

const UserWishlistPage = () => {
  const navigate = useNavigate();
  const { profile } = useAuthStore();
  const { games, loading, error, fetchWishlistGames, fetchWishlistGameIds } = useWishlistStore();

  useEffect(() => {
    if (profile?.id) {
      fetchWishlistGames(profile.id);
      fetchWishlistGameIds(profile.id);
    }
  }, [profile]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 min-h-[400px] flex items-center justify-center">
        <div>
          <p>Error loading wishlist: {error}</p>
          <button
            onClick={() => profile?.id && fetchWishlistGames(profile.id)}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (games.length === 0) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <Empty
          image={<FaHeart className="text-6xl text-gray-400 mx-auto mb-4" />}
          description={
            <div className="text-gray-400">
              <p className="text-lg mb-2">Your wishlist is empty.</p>
              <p className="text-sm">Start adding games you love to your wishlist!</p>
            </div>
          }
        >
          <Button
            onClick={() => navigate("/search")}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Discover Games
          </Button>
        </Empty>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">My Wishlist</h1>
        <p className="text-gray-400">
          {games.length} {games.length === 1 ? "game" : "games"} in your wishlist
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {games.map((game) => (
          <WishlistGameCard key={game.game.id} game={game} />
        ))}
      </div>
    </div>
  );
};

export default UserWishlistPage;
