import CoinIcon from "@/components/coin-icon";
import { formatDateTime } from "@/lib/date-n-time";
import { Transaction, getReadableTransactionType } from "@/types/transaction";
import { Tag } from "antd";
import { ColumnsType } from "antd/es/table";

export const getAdminWalletColumns = (): ColumnsType<Transaction> => [
  {
    title: "NO",
    dataIndex: "no",
    key: "no",
    render: (_, __, index) => index + 1,
  },
  {
    title: "Transaction ID",
    dataIndex: "id",
    key: "id",
    width: 120,
    render: (value) => (
      <span className="font-mono text-blue-400">
        TS-
        {value.split("-")[0].toUpperCase()}
      </span>
    ),
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
        "ReceiveCommercialRefundPackage",
      ];

      const negativeTypes: Transaction["type"][] = [
        "Withdraw",
        "PurchaseGame",
        "PurchaseCommercialPackage",
        "Donation",
        "RefundCommercialPackage",
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
    title: "Payment Method",
    dataIndex: "paymentMethod",
    key: "paymentMethod",
    render: (method: string) => method || "N/A",
  },

  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: (status: string) => (
      <Tag
        color={
          status === "Success"
            ? "green"
            : status === "Failed"
            ? "red"
            : status === "Pending"
            ? "gold"
            : "default"
        }
      >
        {status || "Unknown"}
      </Tag>
    ),
  },
  {
    title: "Description",
    dataIndex: "description",
    key: "description",
    render: (text: string) => text || "-",
  },
  {
    title: "Created At",
    dataIndex: "createdAt",
    key: "createdAt",
    render: (text: string) => formatDateTime(new Date(text)),
  },
];
