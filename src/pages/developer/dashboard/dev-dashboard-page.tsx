import MonthlyRevenueChart from "@/components/charts/monthly-revenue-chart";
import { useGlobalMessage } from "@/components/message-provider";
import { getDevSummaryStatistic } from "@/lib/api/dev-dashboard-api";
import useAuthStore from "@/store/use-auth-store";
import { Game } from "@/types/game";
import { useEffect, useState } from "react";
import MonthStatistic from "./month-statistic";
import { formatCurrencyVND } from "@/lib/currency";
import { Link } from "react-router-dom";

type SummaryData = {
  totalRevenueAllTime: number;
  revenueByMonth: {
    [key: string]: number;
  };
  top5BestSellingGames: { game: Game; purchaseCount: number }[];
};
const DevDashBoardPage = () => {
  const { profile } = useAuthStore();
  const [summaryData, setSummaryData] = useState<SummaryData>({
    totalRevenueAllTime: 0,
    revenueByMonth: {},
    top5BestSellingGames: [],
  });
  const messageApi = useGlobalMessage();

  useEffect(() => {
    fetchSummaryData();
  }, [profile]);

  const fetchSummaryData = async () => {
    if (!profile) return;
    const result = await getDevSummaryStatistic(profile.id);
    if (result.error) {
      messageApi.error("Failed to load statistics! Please try again later.");
    } else {
      setSummaryData(result.data);
    }
  };
  const currentYear = new Date().getFullYear();

  return (
    <div className="p-5">
      <h2 className="text-3xl text-center">Overall Statistic Reports</h2>
      <div className="grid grid-cols-3 gap-3">
        <div>
          <div className="bg-zinc-900 p-5">
            <h3 className="text-lg font-semibold">Total Revenue (All Time)</h3>
            <p className="text-3xl text-orange-500">
              {formatCurrencyVND(summaryData.totalRevenueAllTime)}
            </p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-12 mt-5 gap-3">
        <div className="bg-zinc-900 rounded col-span-8 pb-5">
          <h3 className="pt-3 -mb-3 text-center text-xl font-semibold">
            Monthly Revenue Chart ({currentYear})
          </h3>
          <MonthlyRevenueChart
            revenueByMonth={summaryData.revenueByMonth}
            year={currentYear}
            width={700}
          />
        </div>
        <div className="col-span-4">
          <h3 className="text-xl font-semibold">Top best selling games</h3>
          {summaryData.top5BestSellingGames
            .sort((a, b) => b.purchaseCount - a.purchaseCount)
            .map((entry) => {
              return (
                <div
                  className="bg-zinc-800 mt-2 rounded flex gap-3 highlight-hover"
                  key={entry.game.id}
                >
                  <Link to={`/dev/game/${entry.game.id}`}>
                    <img
                      src={entry.game.coverImage}
                      alt=""
                      className="w-[150px] bg-zinc-900 aspect-video object-contain"
                    />
                  </Link>
                  <div className="">
                    <Link to={`/dev/game/${entry.game.id}`}>
                      <h4 className="font-bold text-lg">{entry.game.name}</h4>
                    </Link>

                    <p>Purchases: {entry.purchaseCount}</p>
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      <MonthStatistic />
    </div>
  );
};

export default DevDashBoardPage;
