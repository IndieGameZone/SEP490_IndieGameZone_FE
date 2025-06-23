import useGameStore from "@/store/use-game-store";
import { Card, Typography } from "antd";

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
    <div className="mb-8">
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

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <Card className="border-0 shadow-md bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <div className="text-center">
            <div className="text-2xl font-bold">{games.length}</div>
            <div className="text-blue-500">Total Games</div>
          </div>
        </Card>
        <Card className="border-0 shadow-md bg-gradient-to-br from-green-500 to-green-600 text-white">
          <div className="text-center">
            <div className="text-2xl font-bold">{totalApproved}</div>
            <div className="text-green-500">Approved</div>
          </div>
        </Card>
        <Card className="border-0 shadow-md bg-gradient-to-br from-red-500 to-red-600 text-white">
          <div className="text-center">
            <div className="text-2xl font-bold">{totalRejected}</div>
            <div className="text-red-500">Rejected</div>
          </div>
        </Card>
        <Card className="border-0 shadow-md bg-gradient-to-br from-orange-500 to-orange-600 text-white">
          <div className="text-center">
            <div className="text-2xl font-bold">{totalPending}</div>
            <div className="text-orange-500">Pending Manual Review</div>
          </div>
        </Card>
        <Card className="border-0 shadow-md bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <div className="text-center">
            <div className="text-2xl font-bold">{totalPendingAI}</div>
            <div className="text-purple-500">Pending AI Review</div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default GamesStatistics;