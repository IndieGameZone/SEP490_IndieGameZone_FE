import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Empty, Button, message } from "antd";
import useAuthStore from "@/store/use-auth-store";
import useLibraryStore from "@/store/use-library-store";
import LibraryGameCard from "./library-game-card";
import { TbLibraryPlus } from "react-icons/tb";
import Loader from "@/components/loader";

const UserLibraryPage = () => {
  const navigate = useNavigate();
  const { profile } = useAuthStore();
  const { ownedGames, loading, fetchOwnedGames, error } = useLibraryStore();
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    if (profile?.id) {
      fetchOwnedGames(profile.id);
    }
  }, [profile?.id]);

  useEffect(() => {
    if (!loading && error) {
      messageApi.error(error);
    }
  }, [loading]);

  if (loading) {
    return <Loader />;
  }

  if (ownedGames.length === 0) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        {contextHolder}
        <Empty
          image={
            <TbLibraryPlus className="text-6xl text-gray-400 mx-auto mb-4" />
          }
          description={
            <div className="text-gray-400">
              <p className="text-lg mb-2">Your Library is empty.</p>
              <p className="text-sm">
                Start buy games you love to your Library!
              </p>
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
      {contextHolder}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">My Library Games</h1>
        <p className="text-gray-400">
          {ownedGames.length} {ownedGames.length === 1 ? "game" : "games"} in
          your Library
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {ownedGames.map((game, index: number) => (
          <LibraryGameCard key={`game-library-${index}`} item={game} />
        ))}
      </div>
    </div>
  );
};

export default UserLibraryPage;
