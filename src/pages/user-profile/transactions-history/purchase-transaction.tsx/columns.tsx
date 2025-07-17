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
    render: (type: string) => <span className="font-mono text-blue-400">{type}</span>,
  },
  {
    title: "Payment Method",
    dataIndex: "paymentMethod",
    key: "paymentMethod",
    width: 150,
    render: (paymentMethod: string) => <span className="font-mono text-blue-400">{paymentMethod}</span>,
  },
  {
  title: "Amount",
  dataIndex: "amount",
  key: "amount",
  width: 550,
  align: "right" as const,
  render: (amount: number = 0, record: Transaction) => {
    const type = record.type.toLowerCase();
    const isDeposit = type === "deposit";
    const isPurchase = type === "purchasegame";
    const isCommercial = type === "purchasecommercialpackage";
    const isWallet = record.paymentMethod === "Wallet";
    const isPayOS = record.paymentMethod === "PayOS";

    const formattedAmount = (amount ?? 0).toLocaleString("vi-VN");

    if (isDeposit) {
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
          {isWallet ? (
            <CoinIcon className="inline size-3 ms-1 mb-1" />
          ) : isPayOS ? (
            <span className="ms-1">₫</span>
          ) : null}
        </span>
      );
    }

    if (isCommercial) {
      return (
        <span className="font-semibold text-red-500">
          -{formattedAmount}
          {isWallet ? (
            <CoinIcon className="inline size-3 ms-1 mb-1" />
          ) : isPayOS ? (
            <span className="ms-1">₫</span>
          ) : null}
        </span>
      );
    }

    return <span className="font-semibold text-gray-500">{formattedAmount}</span>;
  },
},

  {
    title: "Game Price",
    dataIndex: "gamePrice",
    key: "gamePrice",
    width: 550,
    render: (value: number, record: Transaction) => {
      const type = record.type.toLowerCase();
      const isPurchase = type === "purchasegame";
      const isWallet = record.paymentMethod === "Wallet";
      const isPayOS = record.paymentMethod === "PayOS";

      if (isPurchase) {
        return (
          <span className="font-semibold text-red-500">
            -{value.toLocaleString("vi-VN")}
            {isWallet ? (
              <CoinIcon className="inline size-3 ms-1 mb-1" />
            ) : isPayOS ? (
              <span className="ms-1">₫</span>
            ) : null}
          </span>
        );
      }

      return <span className="text-gray-500">{value.toLocaleString("vi-VN")}</span>;
    },
  },
  {
    title: "Donation",
    dataIndex: "donation",
    key: "donation",
    width: 550,
    render: (value: number, record: Transaction) => {
      const type = record.type.toLowerCase();
      const isPurchase = type === "purchasegame";
      const isWallet = record.paymentMethod === "Wallet";
      const isPayOS = record.paymentMethod === "PayOS";

      if (isPurchase && value > 0) {
        return (
          <span className="font-semibold text-red-500">
            -{value.toLocaleString("vi-VN")}
            {isWallet ? (
              <CoinIcon className="inline size-3 ms-1 mb-1" />
            ) : isPayOS ? (
              <span className="ms-1">₫</span>
            ) : null}
          </span>
        );
      }

      return <span className="text-gray-500">{value.toLocaleString("vi-VN")}</span>;
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
    title: "Date",
    dataIndex: "createdAt",
    key: "createdAt",
    width: 1300,
    render: (date: string) => (
      <div className="text-sm">
        <div>{formatDateTime(new Date(date))}</div>
      </div>
    ),
  },
];
