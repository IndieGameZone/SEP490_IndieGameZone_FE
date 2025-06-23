import useGameStore from "@/store/use-game-store";
import { Statistic, Typography } from "antd";

const { Text, Title } = Typography;

const GamesStatistics = () => {
  const { games } = useGameStore();
  const totalApproved = games.filter(
    (g) => g.censorStatus === "Approved"
  ).length;
  const totalPending = games.filter(
    (g) =>
      g.censorStatus === "PendingManualReview" ||
      g.censorStatus === "PendingAIReview"
  ).length;
  const totalRejected = games.filter(
    (g) => g.censorStatus === "Rejected"
  ).length;
  const totalPendingAI = games.filter(
    (g) => g.censorStatus === "PendingAIReview"
  ).length;
  return (
    <div className="mb-8 bg-white p-3 rounded drop-shadow">
      <div className="flex items-center gap-3 mb-4">
        <div>
          <img src="/igz_ic.svg" width={50} />
        </div>
        <div>
          <Title
            level={2}
            className="!mb-1 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
          >
            Game Management
          </Title>
          <Text type="secondary" className="text-base">
            Manage and moderate games in platform
          </Text>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="shadow-md bg-gradient-to-br from-blue-500 to-blue-600 rounded p-5">
          <Statistic
            title={<span className="text-white">Total Games</span>}
            value={games.length}
            valueStyle={{ color: "white" }}
          />
        </div>
        <div className="rounded shadow-md bg-gradient-to-br from-green-500 to-green-600 p-5">
          <Statistic
            title={<span className="text-white">Approved</span>}
            value={totalApproved}
            valueStyle={{ color: "white" }}
          />
        </div>
        <div className="rounded shadow-md bg-gradient-to-br from-red-500 to-red-600 p-5">
          <Statistic
            title={<span className="text-white">Rejected</span>}
            value={totalRejected}
            valueStyle={{ color: "white" }}
          />
        </div>
        <div className="rounded shadow-md bg-gradient-to-br from-orange-500 to-orange-600 p-5">
          <Statistic
            title={<span className="text-white">Pending Manual Review</span>}
            value={totalPending}
            valueStyle={{ color: "white" }}
          />
        </div>
        <div className="rounded shadow-md bg-gradient-to-br from-purple-500 to-purple-600 p-5">
          <Statistic
            title={<span className="text-white">Pending AI Review</span>}
            value={totalPendingAI}
            valueStyle={{ color: "white" }}
          />
        </div>
      </div>
    </div>
  );
};

export default GamesStatistics;
