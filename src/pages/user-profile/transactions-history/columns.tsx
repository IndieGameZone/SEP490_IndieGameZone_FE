import { formatDateTime } from "@/lib/date";
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

const getAmountColor = (amount: number) => {
  return amount > 0 ? "text-green-600" : "text-red-600";
};

export const columns = [
  {
    title: "Transaction ID",
    dataIndex: "orderCode",
    key: "orderCode",
    width: 120,
    render: (orderCode: string) => <span className="font-mono text-blue-400">TSI{orderCode}</span>,
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
    render: (amount: number) => (
      <span className={`font-semibold ${getAmountColor(amount)}`}>
        {amount > 0 ? "+" : ""}
        {amount.toLocaleString("vi-VN")}
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
