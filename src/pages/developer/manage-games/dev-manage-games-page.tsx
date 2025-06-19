import Loader from "@/components/loader";
import useAuthStore from "@/store/use-auth-store";
import useGameStore from "@/store/use-game-store";
import { Button, Input, Pagination, Select } from "antd";
import { useEffect } from "react";
import { FaUpload } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import GameCard from "./game-card";

const sortOptions = [
  {
    value: "most-popular",
    label: "Most popular",
  },
  {
    value: "latest",
    label: "Latest",
  },
];

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
        <div className="flex justify-between ">
          <h1 className="text-2xl font-bold">Your Games</h1>
          <Button
            icon={<FaUpload />}
            type="primary"
            onClick={() => navigate("/dev/upload-game")}
          >
            Upload a new game
          </Button>
        </div>
        <div className="mb-5 py-2 flex justify-between">
          <Input.Search
            placeholder="Search for game titles..."
            style={{ width: 300 }}
          />
          <div className="flex items-center text-zinc-500 gap-2">
            <p className="text-sm">Sort by: </p>
            <Select
              defaultValue="latest"
              style={{ width: 150 }}
              options={sortOptions}
            />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-5">
          {games.map((game, index: number) => {
            return <GameCard game={game} key={`dev-game-${index}`} />;
          })}
        </div>
        <div className="py-3">

        <Pagination align="center" defaultCurrent={1} total={50} />
        </div>
      </div>
    );
  }
};

export default DevManageGamesPage;
