import CoinIcon from "@/components/coin-icon";
import { formatDateTime } from "@/lib/date-n-time";
import { Transaction, getReadableTransactionType } from "@/types/transaction";
import { TableProps, Tag } from "antd";

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

export const columns: TableProps<Transaction>["columns"] = [
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
    title: "Order Code",
    dataIndex: "orderCode",
    key: "orderCode",
    render: (orderCode: string, record) =>
      orderCode ? (
        <span className="font-mono text-blue-400">
          ORD-{new Date(record.createdAt).getFullYear()}-{record.orderCode}
        </span>
      ) : null,
  },
  {
    title: "Type",
    dataIndex: "type",
    key: "type",
    render: (type) => (
      <span className="font-mono text-blue-400">
        {getReadableTransactionType(type)}
      </span>
    ),
    width: 150,
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
    align: "right" as const,
    render: (amount: number = 0, record: Transaction) => {
      const type = record.type.toLowerCase();
      const isDeposit = type === "deposit";
      const isRefund = type === "refundrevenue";
      const isWithdraw = type === "withdraw";
      const isPurchase =
        type === "purchasegame" ||
        type === "purchasecommercialpackage" ||
        type === "donation";
      const isWallet = record.paymentMethod === "Wallet";
      const isPayOS = record.paymentMethod === "PayOS";

      const formattedAmount = (amount ?? 0).toLocaleString("vi-VN");

      const renderSuffix = () => {
        if (isWallet) return <CoinIcon className="inline size-3 ms-1 mb-1" />;
        if (isPayOS) return <span className="ms-1">₫</span>;
        return null;
      };

      if (isDeposit || isRefund) {
        return (
          <span className="font-semibold text-green-500">
            +{formattedAmount}
            <CoinIcon className="inline size-3 ms-1 mb-1" />
          </span>
        );
      }

      if (isPurchase) {
        return (
          <span className="font-semibold text-red-500">
            -{formattedAmount}
            {renderSuffix()}
          </span>
        );
      }

      if (isWithdraw) {
        return (
          <span className="font-semibold text-red-500">
            -{formattedAmount}
            <CoinIcon className="inline size-3 ms-1 mb-1" />
          </span>
        );
      }

      return (
        <span className="font-semibold text-gray-500">{formattedAmount}</span>
      );
    },
  },
  {
    title: "Description",
    dataIndex: "description",
    key: "description",
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: (status: Transaction["status"]) => getStatusTag(status),
  },
  {
    title: "Date",
    dataIndex: "createdAt",
    key: "createdAt",
    render: (date: string) => (
      <div className="text-sm">
        <div>{formatDateTime(new Date(date))}</div>
      </div>
    ),
  },
];
