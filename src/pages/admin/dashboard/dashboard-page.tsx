import BestSellingGames from "./best-selling-games";
import RecentlyPublishedGames from "./recently-published-games";
import TopDownloadedGames from "./top-downloaded-games";
import TopRatedGames from "./top-rated-games";

const DashBoardPage = () => {
  return (
    <div className="grid md:grid-cols-12 gap-3">
      <div className="md:col-span-12">
        <RecentlyPublishedGames />
        <hr className="my-5 border-zinc-300"/>
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
