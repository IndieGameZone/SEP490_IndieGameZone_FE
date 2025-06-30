import CoinIcon from "@/components/coin-icon";
import { formatDateTime } from "@/lib/date-n-time";
import { Transaction } from "@/types/transaction";
import { Tag } from "antd";

const getStatusTag = (status: Transaction["status"]) => {
  const statusConfig: Record<Transaction["status"], { color: string; text: string }> = {
    Success: { color: "green", text: "Success" },
    Pending: { color: "orange", text: "Pending" },
    Failed: { color: "red", text: "Failed" },
  };
  const config = statusConfig[status] || statusConfig.Pending;
  return <Tag color={config.color}>{config.text}</Tag>;
};

export const columns = [
  {
    title: "Transaction ID",
    dataIndex: "orderCode",
    key: "orderCode",
    width: 120,
    render: (orderCode: string) => <span className="font-mono text-blue-400">TS-{orderCode}</span>,
  },
  {
    title: "Type",
    dataIndex: "type",
    key: "type",
    width: 80,
    render: (type: string) => <span className="font-mono text-blue-400">{type}</span>,
  },
  {
    title: "Amount",
    dataIndex: "amount",
    key: "amount",
    width: 120,
    align: "right" as const,
    render: (amount: number, record: Transaction) => (
      <span
        className={`font-semibold ${
          record.status === "Pending"
            ? "text-orange-500"
            : record.type === "deposit"
            ? "text-green-500"
            : "text-red-500"
        }`}
      >
        {record.type === "deposit" ? "+" : "-"}
        {record.type === "deposit" ? (
          <>
            {amount.toLocaleString("vi-VN")}
            <CoinIcon className="inline size-3 ms-1 mb-1" />
          </>
        ) : (
          <>
            {amount.toLocaleString("vi-VN")}
            <CoinIcon className="inline size-3 ms-1 mb-1" />
          </>
        )}
      </span>
    ),
  },
  {
    title: "Description",
    dataIndex: "description",
    key: "description",
    width: 400,
  },

  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    width: 120,
    render: (status: Transaction["status"]) => getStatusTag(status),
  },

  {
    title: "Date",
    dataIndex: "date",
    key: "date",
    width: 160,
    render: (date: string) => (
      <div className="text-sm">
        <div>{formatDateTime(new Date(date))}</div>
      </div>
    ),
  },
];
