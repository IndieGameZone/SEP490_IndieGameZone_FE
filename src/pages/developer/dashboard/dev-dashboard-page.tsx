import MonthlyRevenueChart from "@/components/charts/dev/monthly-revenue-chart";
import { useGlobalMessage } from "@/components/message-provider";
import { getDevSummaryStatistic } from "@/lib/api/dev-dashboard-api";
import useAuthStore from "@/store/use-auth-store";
import { Game } from "@/types/game";
import { useEffect, useState } from "react";
import MonthStatistic from "./month-statistic";
import { formatCurrencyVND } from "@/lib/currency";
import { Link } from "react-router-dom";
import FaultTolerantImage from "@/components/fault-tolerant-image";
import { FaDownload } from "react-icons/fa";

type SummaryData = {
  totalRevenueAllTime: number;
  totalDonationAllTime: number;
  revenueByMonth: {
    [key: string]: number;
  };
  top5BestDownloadedGames: { game: Game; numberOfDownloads: number }[];
};
const DevDashBoardPage = () => {
  const { profile } = useAuthStore();
  const [summaryData, setSummaryData] = useState<SummaryData>({
    totalRevenueAllTime: 0,
    totalDonationAllTime: 0,
    revenueByMonth: {},
    top5BestDownloadedGames: [],
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
        <div className=" grid grid-cols-2 gap-3 col-span-2">
          <div className="bg-zinc-900 p-5">
            <h3 className="text-lg font-semibold">Total Revenue (All Time)</h3>
            <p className="text-3xl text-orange-400">
              {formatCurrencyVND(summaryData.totalRevenueAllTime)}
            </p>
          </div>
          <div className="bg-zinc-900 p-5">
            <h3 className="text-lg font-semibold">Total Donation (All Time)</h3>
            <p className="text-3xl text-green-400">
              {formatCurrencyVND(summaryData.totalDonationAllTime)}
            </p>
          </div>
          <div className="bg-zinc-900 rounded col-span-2 pb-5">
            <h3 className="pt-3 -mb-3 text-center text-xl font-semibold">
              Monthly Revenue Chart ({currentYear})
            </h3>
            <MonthlyRevenueChart
              revenueByMonth={summaryData.revenueByMonth}
              year={currentYear}
              width={700}
            />
          </div>
        </div>
        <div className="col-span-1">
          <h3 className="text-xl font-semibold">Most downloaded games</h3>
          {summaryData.top5BestDownloadedGames
            .sort((a, b) => b.numberOfDownloads - a.numberOfDownloads)
            .map((entry) => {
              return (
                <div
                  className="bg-zinc-800 mt-2 rounded flex gap-3 highlight-hover"
                  key={entry.game.id}
                >
                  <Link to={`/dev/game/${entry.game.id}`} className="flex-shrink-0">
                    <FaultTolerantImage
                      src={entry.game.coverImage}
                      alt=""
                      className="w-[150px] bg-zinc-900 aspect-video object-contain"
                    />
                  </Link>
                  <div className="">
                    <Link to={`/dev/game/${entry.game.id}`}>
                      <h4 className="font-bold text-lg break-words">{entry.game.name}</h4>
                    </Link>
                    <p className="text-sm text-zinc-400">{entry.game.category.name}</p>

                    <p className="flex items-center gap-1">
                      <FaDownload />: {entry.numberOfDownloads}
                    </p>
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
