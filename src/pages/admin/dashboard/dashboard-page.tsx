import BestSellingGames from "./best-selling-games";
import TopDownloadedGames from "./top-downloaded-games";

const DashBoardPage = () => {
  return (
    <div className="grid md:grid-cols-12 gap-3">
      <div className="md:col-span-4">
        <TopDownloadedGames />
      </div>
      <div className="md:col-span-4">
        <BestSellingGames />
      </div>
    </div>
  );
};

export default DashBoardPage;
