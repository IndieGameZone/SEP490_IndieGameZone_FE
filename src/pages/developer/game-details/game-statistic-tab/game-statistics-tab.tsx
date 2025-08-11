import { useParams } from "react-router-dom";
import MonthStatistic from "./month-statistic";
import MonthlyRevenueChart from "../../../../components/charts/monthly-revenue-chart";
import { useEffect, useState } from "react";
import { getGameSummaryStatistic } from "@/lib/api/dev-dashboard-api";
import { formatCurrencyVND } from "@/lib/currency";
import useGameStore from "@/store/use-game-store";

type Revenue = {
  totalRevenueAllTime: number;
  totalDonationAllTime: number;
  revenueByMonth: {
    [key: string]: number;
  };
};

const GameStatisticsTab = () => {
  const [revenueData, setRevenueData] = useState<Revenue>({
    totalRevenueAllTime: 0,
    totalDonationAllTime: 0,
    revenueByMonth: {},
  });
  const { gameId } = useParams();
  const { game } = useGameStore();

  useEffect(() => {
    fetchSummaryStatistic();
  }, []);

  const fetchSummaryStatistic = async () => {
    if (!gameId) return;
    const result = await getGameSummaryStatistic(gameId);
    if (!result.error) {
      setRevenueData(result.data);
    }
  };

  if (!gameId) return;
  const currentYear = new Date().getFullYear();
  return (
    <div className="p-5">
      <h2 className="text-3xl text-center">
        Statistic reports for "{game?.name}"
      </h2>
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-zinc-900 p-5">
          <h3 className="text-lg font-semibold">Total Revenue (All Time)</h3>
          <p className="text-3xl text-orange-400">
            {formatCurrencyVND(revenueData.totalRevenueAllTime)}
          </p>
        </div>
        <div className="bg-zinc-900 p-5">
          <h3 className="text-lg font-semibold">Total Donation (All Time)</h3>
          <p className="text-3xl text-green-400">
            {formatCurrencyVND(revenueData.totalDonationAllTime)}
          </p>
        </div>
      </div>
      <div className="bg-zinc-900 rounded mt-5">
        <h3 className="pt-3 -mb-3 text-center text-xl font-semibold">
          Monthly Revenue Chart ({currentYear})
        </h3>
        <MonthlyRevenueChart
          revenueByMonth={revenueData.revenueByMonth}
          year={currentYear}
        />
      </div>
      <MonthStatistic gameId={gameId} />
    </div>
  );
};

export default GameStatisticsTab;
