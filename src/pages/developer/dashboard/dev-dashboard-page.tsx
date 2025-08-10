import MonthlyRevenueChart from "@/components/charts/monthly-revenue-chart";
import { useGlobalMessage } from "@/components/message-provider";
import { getDevSummaryStatistic } from "@/lib/api/dev-dashboard-api";
import useAuthStore from "@/store/use-auth-store";
import { Game } from "@/types/game";
import { useEffect, useState } from "react";
import MonthStatistic from "./month-statistic";

type SummaryData = {
  totalRevenueAllTime: number;
  revenueByMonth: {
    [key: string]: number;
  };
  top5BestSellingGames: Game[];
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
      <div className="bg-zinc-900 rounded mt-5">
        <h3 className="pt-3 -mb-3 text-center text-xl font-semibold">
          Monthly Revenue Chart ({currentYear})
        </h3>
        <MonthlyRevenueChart
          revenueByMonth={summaryData.revenueByMonth}
          year={currentYear}
        />
      </div>
      <MonthStatistic />
    </div>
  );
};

export default DevDashBoardPage;
