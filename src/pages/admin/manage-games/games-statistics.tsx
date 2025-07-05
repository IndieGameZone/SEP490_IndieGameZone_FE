import Loader from "@/components/loader";
import useGameStore from "@/store/use-game-store";
import { Statistic, Typography, message } from "antd";
import { useEffect } from "react";

const { Text, Title } = Typography;

const GamesStatistics = () => {
  const { statistics, loadingStatistics, error, fetchGameStatistics } = useGameStore();

  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    fetchGameStatistics();
  }, [fetchGameStatistics]);

  useEffect(() => {
    if (error) {
      messageApi.error(`Failed to load statistics: ${error}`);
    }
  }, [error, messageApi]);

  const getStatistics = () => {
    if (statistics) {
      return {
        total: statistics.total,
        approved: statistics.approve,
        rejected: statistics.reject,
        pendingManual: statistics.manual,
        pendingAI: statistics.ai,
      };
    }
    return null;
  };

  const stats = getStatistics();
  const totalPending = stats ? stats.pendingManual + stats.pendingAI : 0;

  if (loadingStatistics) {
    return (
      <div className="mb-8 bg-white p-3 rounded drop-shadow">
        <div className="flex justify-center items-center py-8">
          <Loader />
        </div>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <>
      {contextHolder}
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
              value={stats.total}
              valueStyle={{ color: "white" }}
            />
          </div>
          <div className="rounded shadow-md bg-gradient-to-br from-green-500 to-green-600 p-5">
            <Statistic
              title={<span className="text-white">Approved</span>}
              value={stats.approved}
              valueStyle={{ color: "white" }}
            />
          </div>
          <div className="rounded shadow-md bg-gradient-to-br from-red-500 to-red-600 p-5">
            <Statistic
              title={<span className="text-white">Rejected</span>}
              value={stats.rejected}
              valueStyle={{ color: "white" }}
            />
          </div>
          <div className="rounded shadow-md bg-gradient-to-br from-orange-500 to-orange-600 p-5">
            <Statistic
              title={<span className="text-white">Pending Review</span>}
              value={totalPending}
              valueStyle={{ color: "white" }}
            />
          </div>
          <div className="rounded shadow-md bg-gradient-to-br from-purple-500 to-purple-600 p-5">
            <Statistic
              title={<span className="text-white">Pending AI Review</span>}
              value={stats.pendingAI}
              valueStyle={{ color: "white" }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default GamesStatistics;
