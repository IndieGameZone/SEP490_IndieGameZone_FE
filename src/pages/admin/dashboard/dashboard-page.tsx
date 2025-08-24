import BestSellingGames from "./best-selling-games";
import DashboardSummary from "./dashboard-summary";
import RecentlyPublishedGames from "./recently-published-games";
import RevenueByMonthChart from "./revenue-by-month-chart";
import TopDownloadedGames from "./top-downloaded-games";
import TopRatedGames from "./top-rated-games";

const DashBoardPage = () => {
  return (
    <div className="grid md:grid-cols-12 gap-3">
      <DashboardSummary />
      <div className="md:col-span-12">
        <RevenueByMonthChart />
      </div>
      <div className="md:col-span-12">
        <RecentlyPublishedGames />
        <hr className="my-5 border-zinc-300" />
      </div>
      <div className="md:col-span-6">
        <TopDownloadedGames />
      </div>
      <div className="md:col-span-6">
        <TopRatedGames />
      </div>
      <div className="md:col-span-6">
        <BestSellingGames />
      </div>
    </div>
  );
};

export default DashBoardPage;
