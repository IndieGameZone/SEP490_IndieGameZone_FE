import GameCard from "@/components/game-card";
import Loader from "@/components/loader";
import { useGlobalMessage } from "@/components/message-provider";
import { getRecommendedGames } from "@/lib/api/game-api";
import useAuthStore from "@/store/use-auth-store";
import { Game } from "@/types/game";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const GameRecommendationsPage = () => {
  const [recommendedGames, setRecommendedGames] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messageApi = useGlobalMessage();
  const { profile } = useAuthStore();
  useEffect(() => {
    fetchRecommendedGames();
  }, [profile]);

  const fetchRecommendedGames = async () => {
    if (!profile) return;
    setIsLoading(true);
    const result = await getRecommendedGames(profile.id);
    setIsLoading(false);
    if (!result.error) {
      setRecommendedGames(result.data);
    } else {
      messageApi.error("Failed to load games. Please try again!");
    }
  };

  return (
    <div className="p-5">
      <h2 className="text-xl font-semibold">Recommended for you</h2>
      <p className="text-sm text-zinc-400 mb-3">
        Here are some things you might like based on your rating, purchase, and
        download history. Improve your recommendations by{" "}
        <Link to={`/search`} className="underline text-white">
          rating more games
        </Link>
        .
      </p>
      {isLoading ? (
        <div className="py-10">
          <Loader type="inline" />
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-3">
          {recommendedGames.map((game) => (
            <GameCard game={game} key={game.id} />
          ))}
        </div>
      )}
    </div>
  );
};

export default GameRecommendationsPage;
