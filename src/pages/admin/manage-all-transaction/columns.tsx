import CoinIcon from "@/components/coin-icon";
import { formatDateTime } from "@/lib/date-n-time";
import { Transaction, getReadableTransactionType } from "@/types/transaction";
import { Tag } from "antd";
import ActionMenu from "./action-menu";
import { ColumnsType } from "antd/es/table";

const getStatusTag = (status: Transaction["status"]) => {
  const statusConfig: Record<
    Transaction["status"],
    { color: string; text: string }
  > = {
    Success: { color: "green", text: "Success" },
    Pending: { color: "orange", text: "Pending" },
    Failed: { color: "red", text: "Failed" },
  };
  const config = statusConfig[status] || statusConfig.Pending;
  return <Tag color={config.color}>{config.text}</Tag>;
};

export const getAllTransactionColumns = (
  onRefresh?: () => void
): ColumnsType<Transaction> => [
  {
    title: "ID",
    dataIndex: "id",
    key: "id",
    width: 120,
    render: (value) => <span className="font-mono text-blue-400">{value}</span>,
  },
  {
    title: "Type",
    dataIndex: "type",
    key: "type",
    width: 150,
    render: (type) => (
      <span className="font-mono text-blue-400">
        {getReadableTransactionType(type)}
      </span>
    ),
  },
  {
    title: "Payment Method",
    dataIndex: "paymentMethod",
    key: "paymentMethod",
    width: 150,
    render: (paymentMethod: string) => (
      <span className="font-mono text-blue-400">{paymentMethod}</span>
    ),
  },
  {
    title: "Amount",
    dataIndex: "amount",
    key: "amount",
    width: 120,
    align: "right" as const,
    render: (amount: number, record: Transaction) => {
      const positiveTypes: Transaction["type"][] = [
        "Deposit",
        "PurchaseGameRevenue",
        "PurchaseCommercialPackageRevenue",
        "DonationRevenue",
        "RefundRevenue",
      ];

      const negativeTypes: Transaction["type"][] = [
        "Withdraw",
        "PurchaseGame",
        "PurchaseCommercialPackage",
        "Donation",
        "Refund",
      ];

      const isPositive = positiveTypes.includes(record.type);
      const isNegative = negativeTypes.includes(record.type);

      let textColor = "";
      if (record.status === "Pending") {
        textColor = "text-orange-500";
      } else if (isPositive) {
        textColor = "text-green-500";
      } else if (isNegative) {
        textColor = "text-red-500";
      }

      return (
        <span className={`font-semibold ${textColor}`}>
          {isPositive ? "+" : "-"}
          {amount.toLocaleString("vi-VN")}
          <CoinIcon className="inline size-3 ms-1 mb-1" />
        </span>
      );
    },
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
    title: "Created At",
    dataIndex: "createdAt",
    key: "createdAt",
    width: 160,
    render: (createdAt: string) => (
      <div className="text-sm">
        <div>{formatDateTime(new Date(createdAt))}</div>
      </div>
    ),
  },
  {
    title: "Action",
    key: "action",
    render: (_, record: Transaction) => (
      <ActionMenu record={record} onSuccess={onRefresh} />
    ),
  },
];
