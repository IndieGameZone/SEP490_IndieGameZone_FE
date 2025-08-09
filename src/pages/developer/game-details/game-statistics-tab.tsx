import { useParams } from "react-router-dom";
import MonthStatistic from "./game-statistic-tab/month-statistic";
import MonthlyRevenueChart from "./game-statistic-tab/monthly-revenue-chart";
import { useEffect, useState } from "react";
import { getGameSummaryStatistic } from "@/lib/api/dev-dashboard-api";

const GameStatisticsTab = () => {
  const [revenueByMonth, setRevenueByMonth] = useState<any>({});
  const { gameId } = useParams();

  useEffect(() => {
    fetchSummaryStatistic();
  }, []);

  const fetchSummaryStatistic = async () => {
    if (!gameId) return;
    const result = await getGameSummaryStatistic(gameId);
    if (!result.error) {
      setRevenueByMonth(result.data.revenueByMonth);
    }
  };

  if (!gameId) return;
  const currentYear = new Date().getFullYear();
  return (
    <div className="p-5">
      <div className="bg-zinc-900 rounded mt-2">
        <h3 className="pt-3 -mb-3 text-center text-xl font-semibold">
          Monthly Revenue Chart ({currentYear})
        </h3>
        <MonthlyRevenueChart
          revenueByMonth={revenueByMonth}
          year={currentYear}
        />
      </div>
      <MonthStatistic gameId={gameId} />
    </div>
  );
};

export default GameStatisticsTab;
