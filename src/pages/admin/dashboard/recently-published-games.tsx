import { Game, GameCensorStatus } from "@/types/game";
import Table, { ColumnsType } from "antd/es/table";
import GameInfo from "../manage-games/game-info";
import { formatCurrencyVND } from "@/lib/currency";
import { Tag } from "antd";
import { ModerationStatusTag } from "@/components/status-tags";
import { AiOutlineUser } from "react-icons/ai";
import { useEffect, useState } from "react";
import { getRecentlyPublishedGames } from "@/lib/api/admin-dashboard-api";
import { timeAgo } from "@/lib/date-n-time";
import { FaRegClock } from "react-icons/fa";

const columns: ColumnsType<Game> = [
  {
    title: "Game Info",
    key: "gameInfo",
    render: (_, record: Game) => <GameInfo game={record} simple />,
    width: 400,
  },
  {
    title: "Price",
    key: "price",
    render: (_, record: Game) => (
      <div className="">
        {record.price == 0 ? (
          <div className="text-lg font-bold text-green-600">Free</div>
        ) : (record.discount || 0) > 0 ? (
          <div>
            <div className="text-lg font-bold text-green-600">
              {formatCurrencyVND(record.priceAfterDiscount ?? 0)}
            </div>
            <div className="text-sm text-gray-500 line-through">
              {formatCurrencyVND(record.price ?? 0)}
            </div>
            <Tag color="red">{record.discount}% OFF</Tag>
          </div>
        ) : (
          <div className="text-lg font-bold text-gray-900">
            {formatCurrencyVND(record.price ?? 0)}
          </div>
        )}
      </div>
    ),
    sorter: (a, b) => (a.priceAfterDiscount || 0) - (b.priceAfterDiscount || 0),
  },
  {
    title: "Status",
    dataIndex: "censorStatus",
    key: "censorStatus",
    render: (status: GameCensorStatus) => (
      <ModerationStatusTag status={status} />
    ),
    filters: [
      { text: "Approved", value: "Approved" },
      { text: "Pending Manual Review", value: "PendingManualReview" },
      { text: "Pending AI Review", value: "PendingAiReview" },
      { text: "Rejected", value: "Rejected" },
    ],
    onFilter: (value, record) => record.censorStatus === value,
  },
  {
    title: "Created",
    dataIndex: "createdAt",
    key: "createdAt",
    render: (date: string) => (
      <div className="text-sm text-gray-600">
        <div className="flex items-center gap-1 mb-1">
          <FaRegClock />
          {timeAgo(new Date(date))}
        </div>
      </div>
    ),
    sorter: (a, b) =>
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  },
  {
    title: "Updated",
    dataIndex: "updatedAt",
    key: "updatedAt",
    render: (date: string | null) => {
      if (date) {
        return (
          <div className="text-sm text-gray-600">
            <FaRegClock />
            {timeAgo(new Date(date))}
          </div>
        );
      }
    },
    sorter: (a, b) => {
      const dateA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
      const dateB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
      return dateA - dateB;
    },
  },

  {
    title: "Approve By",
    dataIndex: "censorBy",
    key: "censorBy",
    render: (censorBy: string | null) => (
      <div className="text-sm text-gray-600">
        {censorBy ? (
          <div className="flex items-center gap-1">
            <AiOutlineUser className="text-xs" />
            {censorBy}
          </div>
        ) : (
          "-"
        )}
      </div>
    ),
  },
];

const RecentlyPublishedGames = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchGames = async () => {
    setLoading(true);
    const result = await getRecentlyPublishedGames(5);
    if (!result.error) {
      setGames(result.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchGames();
  }, []);

  return (
    <div>
      <h3 className="text-xl font-semibold mb-2">Recently Published Games</h3>
      <Table<Game>
        columns={columns}
        dataSource={games}
        rowKey="id"
        loading={loading}
        className="overflow-x-auto"
        scroll={{ x: 1400 }}
        rowClassName="hover:bg-blue-50/50 transition-colors duration-150"
        pagination={false}
      />
    </div>
  );
};

export default RecentlyPublishedGames;
