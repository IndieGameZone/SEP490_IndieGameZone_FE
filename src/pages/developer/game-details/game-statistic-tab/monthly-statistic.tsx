import { useEffect, useState } from "react";
import { getGameMonthlyStatistic } from "@/lib/api/dev-dashboard-api";
import GameRevenueChart from "./game-revenue-chart";
import GameDownloadChart from "./game-download-chart";

type MonthlyStatisticProps = {
  gameId: string;
};

type ChartData = {
  day: number;
  downloadCount: number;
  revenue: number;
};

const MonthlyStatistic = ({ gameId }: MonthlyStatisticProps) => {
  const [gameMonthlyStatistic, setGameMonthlyStatistic] = useState<ChartData[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const result = await getGameMonthlyStatistic(gameId, 8, 2025);
    if (!result.error) {
      setGameMonthlyStatistic(result.data);
    }
  };

  return (
    <div>
      <div className="bg-zinc-900 rounded">
        <GameRevenueChart data={gameMonthlyStatistic} />
      </div>
      <div className="bg-zinc-900 rounded mt-2">
        <GameDownloadChart data={gameMonthlyStatistic} />
      </div>
    </div>
  );
};

export default MonthlyStatistic;
