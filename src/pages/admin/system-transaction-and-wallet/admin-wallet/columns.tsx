import { formatCurrencyVND } from "@/lib/currency";
import { formatDateTime } from "@/lib/date-n-time";
import { Transaction } from "@/types/transaction";
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
    title: "User",
    dataIndex: "user",
    key: "user.userName",
    render: (user) => user?.userName || "N/A",
  },
  {
    title: "Amount",
    dataIndex: "amount",
    key: "amount",
    render: (amount: number) => formatCurrencyVND(amount),
  },
  {
    title: "Payment Method",
    dataIndex: "paymentMethod",
    key: "paymentMethod",
    render: (method: string) => method || "N/A",
  },
  {
    title: "Transaction Type",
    dataIndex: "type",
    key: "type",
    render: (type: string) => <span>{type}</span>,
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: (status: string) => (
      <Tag
        color={status === "Success" ? "green" : status === "Failed" ? "red" : status === "Pending" ? "gold" : "default"}
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
