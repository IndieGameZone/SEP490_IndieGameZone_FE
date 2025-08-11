import GameCard from "@/components/game-card";
import Loader from "@/components/loader";
import { useGlobalMessage } from "@/components/message-provider";
import { getDevActiveGames } from "@/lib/api/game-api";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Game } from "@/types/game";

const ViewUserGames = () => {
  const { userId } = useParams();
  const [gamesActive, setGamesActive] = useState<Game[]>([]);
  const [loading, setLoading] = useState(false);
  const messageApi = useGlobalMessage();
  useEffect(() => {
    fetchUserGames();
  }, [userId]);

  const fetchUserGames = async () => {
    if (!userId) return;
    setLoading(true);
    const result = await getDevActiveGames(userId);
    setLoading(false);
    if (!result.error) {
      setGamesActive(result.data);
    } else {
      messageApi.error("Failed to load games. Please try again!");
    }
  };
  return (
    <div className="bg-zinc-900/30 border border-zinc-700 p-3 rounded">
      <h2 className="text-xl font-semibold">
        All games available on developer's platform
      </h2>
      <p className="text-sm text-zinc-400 mb-3">
        Here are all the games from developer have been publicly tested and
        approved on our platform.
      </p>
      {loading ? (
        <div className="py-10">
          <Loader type="inline" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {gamesActive.map((game) => (
            <GameCard game={game} key={game.id} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewUserGames;
