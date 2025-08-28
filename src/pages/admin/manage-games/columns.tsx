import { formatCurrencyVND } from "@/lib/currency";
import { Game, GameCensorStatus } from "@/types/game";
import { CalendarOutlined, UserOutlined } from "@ant-design/icons";
import { Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import ActionMenu from "./action-menu";
import { ModerationStatusTag } from "@/components/status-tags";
import GameInfo from "./game-info";

const getColumns = (rerender: () => void): ColumnsType<Game> => {
  return [
    {
      title: "Game Info",
      key: "gameInfo",
      render: (_, record: Game) => <GameInfo game={record} />,
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
      sorter: (a, b) =>
        (a.priceAfterDiscount || 0) - (b.priceAfterDiscount || 0),
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
            <CalendarOutlined className="text-xs" />
            {new Date(date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
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
      render: (date: string | null) => (
        <div className="text-sm text-gray-600">
          {date
            ? new Date(date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })
            : "-"}
        </div>
      ),
      sorter: (a, b) => {
        const dateA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
        const dateB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
        return dateA - dateB;
      },
    },
    {
      title: "Censor Date",
      dataIndex: "censoredAt",
      key: "censoredAt",
      render: (date: string | null) => (
        <div className="text-sm text-gray-600">
          {date
            ? new Date(date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })
            : "-"}
        </div>
      ),
    },
    {
      title: "Approve By",
      dataIndex: "censorBy",
      key: "censorBy",
      render: (censorBy: string | null) => (
        <div className="text-sm text-gray-600">
          {censorBy ? (
            <div className="flex items-center gap-1">
              <UserOutlined className="text-xs" />
              {censorBy}
            </div>
          ) : (
            "-"
          )}
        </div>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record: Game) => (
        <ActionMenu record={record} rerender={rerender} />
      ),
      width: 80,
      fixed: "right",
    },
  ];
};

export default getColumns;
