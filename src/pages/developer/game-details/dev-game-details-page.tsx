import Loader from "@/components/loader";
import { useHashState } from "@/hooks/use-hash-state";
import GameNotFound from "@/pages/errors/game-not-found";
import useGameStore from "@/store/use-game-store";
import { Tabs, TabsProps } from "antd";
import { useEffect } from "react";
import { FaChartBar, FaInfoCircle } from "react-icons/fa";
import { IoIosChatboxes } from "react-icons/io";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import GameInfoTab from "./game-info-tab";
import GameReviewTab from "./game-review-tab/game-reviews-tab";
import GameStatisticsTab from "./game-statistic-tab/game-statistics-tab";

const DevGameDetailPages = () => {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const { fetchGameById, loading, error, game } = useGameStore();
  const [activeTab, setActiveTab] = useHashState("game-info");

  useEffect(() => {
    if (gameId) {
      fetchGameById(gameId);
    } else {
      navigate("/");
    }
  }, [gameId]);

  useEffect(() => {
    window.scrollTo({
      top: 0,
    });
  }, []);

  const tabItems: TabsProps["items"] = [
    {
      key: "game-info",
      label: (
        <div className="flex gap-2 items-center">
          <FaInfoCircle />
          Game Info
        </div>
      ),
      children: <GameInfoTab />,
    },
    {
      key: "game-statistics",
      label: (
        <div className="flex gap-2 items-center">
          <FaChartBar />
          Game Statistics
        </div>
      ),
      children: <GameStatisticsTab />,
    },
    {
      key: "game-reviews",
      label: (
        <div className="flex gap-2 items-center">
          <IoIosChatboxes />
          Game Reviews
        </div>
      ),
      children: <GameReviewTab />,
    },
  ];

  if (!gameId) {
    return <Navigate to={`/`} />;
  }
  if (loading) {
    return <Loader />;
  }
  if (error) {
    return <GameNotFound />;
  }
  return (
    <div>
      <h1 className="p-3 bg-zinc-900 text-xl font-bold text-center border-b border-zinc-700">
        {game?.name}
      </h1>
      <Tabs
        defaultActiveKey={activeTab}
        centered
        items={tabItems}
        tabBarStyle={{ background: "#18181b", marginBottom: 0 }}
        onChange={(key) => {
          setActiveTab(key);
        }}
      />
    </div>
  );
};

export default DevGameDetailPages;
