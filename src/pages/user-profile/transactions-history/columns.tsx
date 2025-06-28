import { Transaction } from "@/types/transaction";
import { Tag } from "antd";
import { FaArrowDown, FaArrowUp, FaCoins } from "react-icons/fa";
import ActionMenu from "./action-menu";
const getTypeIcon = (type: Transaction["type"]) => {
  switch (type) {
    case "topup":
      return <FaArrowUp className="text-green-500" />;
    case "purchase":
      return <FaArrowDown className="text-red-500" />;
    default:
      return <FaCoins className="text-gray-500" />;
  }
};

const getStatusTag = (status: Transaction["status"]) => {
  const statusConfig: Record<
    Transaction["status"],
    { color: string; text: string }
  > = {
    completed: { color: "green", text: "Completed" },
    pending: { color: "orange", text: "Pending" },
    failed: { color: "red", text: "Failed" },
  };
  const config = statusConfig[status] || statusConfig.pending;
  return <Tag color={config.color}>{config.text}</Tag>;
};

const getAmountColor = (amount: number) => {
  return amount > 0 ? "text-green-600" : "text-red-600";
};

export const columns = [
  {
    title: "Transaction ID",
    dataIndex: "id",
    key: "id",
    width: 120,
    render: (text: string) => (
      <span className="font-mono text-blue-400">{text}</span>
    ),
  },
  {
    title: "Type",
    dataIndex: "type",
    key: "type",
    width: 80,
    align: "center" as const,
    render: (type: Transaction["type"]) => (
      <div className="flex justify-center">{getTypeIcon(type)}</div>
    ),
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
    title: "Method",
    dataIndex: "method",
    key: "method",
    width: 130,
    render: (method: Transaction["method"]) => {
      const methodNames: Record<Transaction["method"], string> = {
        bank_transfer: "Bank Transfer",
        ewallet: "E-Wallet",
        points: "Points",
        credit_card: "Credit Card",
      };
      return methodNames[method] || method;
    },
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    width: 120,
    align: "center" as const,
    render: (status: Transaction["status"]) => getStatusTag(status),
  },
  {
    title: "Date",
    dataIndex: "date",
    key: "date",
    width: 160,
    render: (date: string) => (
      <div className="text-sm">
        <div>{date.split(" ")[0]}</div>
        <div className="text-gray-500">{date.split(" ")[1]}</div>
      </div>
    ),
  },
  {
    title: "Action",
    key: "action",
    width: 120,
    align: "center" as const,
    render: (_: any, record: Transaction) => <ActionMenu record={record} />,
  },
];
