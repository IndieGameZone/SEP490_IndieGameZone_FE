import { useParams } from "react-router-dom";
import MonthlyStatistic from "./game-statistic-tab/monthly-statistic";

const GameStatisticsTab = () => {
  const { gameId } = useParams();

  if (!gameId) return;
  return (
    <div className="p-5">
      <MonthlyStatistic gameId={gameId} />
    </div>
  );
};

export default GameStatisticsTab;
