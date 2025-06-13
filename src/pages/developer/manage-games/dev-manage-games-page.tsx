import Loader from "@/components/loader";
import useAuthStore from "@/store/use-auth-store";
import useGameStore from "@/store/use-game-store";
import { Button } from "antd";
import { useEffect } from "react";
import { FaUpload } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import GameCard from "./game-card";

const DevManageGamesPage = () => {
  const navigate = useNavigate();
  const { profile } = useAuthStore();
  const { fetchGameByDeveloperId, loading, games } = useGameStore();
  useEffect(() => {
    if (profile) {
      fetchGameByDeveloperId(profile.id);
    }
  }, []);

  if (loading) return <Loader />;
  if (games.length == 0) {
    return (
      <div className="min-h-[70vh] flex flex-col justify-center items-center">
        <p className="text-4xl font-semibold">Are you a developer?</p>
        <p className="text-xl"> Upload your first game</p>
        <Button
          icon={<FaUpload />}
          type="primary"
          className="mt-5"
          onClick={() => navigate("/dev/upload-game")}
        >
          Upload a new game
        </Button>
      </div>
    );
  } else {
    return (
      <div className="min-h-[70vh] p-5">
        <div className="flex justify-between mb-5">
          <h1 className="text-2xl font-bold">Your Games</h1>
          <Button
            icon={<FaUpload />}
            type="primary"
            onClick={() => navigate("/dev/upload-game")}
          >
            Upload a new game
          </Button>
        </div>
        <div className="grid grid-cols-4 gap-5">
          {games.map((game, index: number) => {
            return <GameCard game={game} key={`dev-game-${index}`} />;
          })}
        </div>
      </div>
    );
  }
};

export default DevManageGamesPage;
