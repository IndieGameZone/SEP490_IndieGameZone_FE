// columns.tsx
import { formatDateTime } from "@/lib/date-n-time";
import { Withdraw } from "@/types/withdraw-request";
import { ColumnsType } from "antd/es/table";

export const withdrawRequestColumns: ColumnsType<Withdraw> = [
  {
    title: "Withdraw Request ID",
    dataIndex: "id",
    key: "id",
  },
  {
    title: "Amount",
    dataIndex: "amount",
    key: "amount",
  },
  {
    title: "Description",
    dataIndex: "description",
    key: "description",
  },
  {
    title: "Image Proof",
    dataIndex: "imageProof",
    key: "imageProof",
  },
  {
    title: "Is Transferred",
    dataIndex: "isTransfered",
    key: "isTransfered",
    render: (text) => (text ? "Yes" : "No"),
  },
  {
    title: "Message",
    dataIndex: "message",
    key: "message",
  },

  {
    title: "Created At",
    dataIndex: "createdAt",
    key: "createdAt",
    render: (text) => formatDateTime(new Date(text)),
  },
  {
    title: "Handled Date",
    dataIndex: "handledAt",
    key: "handledAt",
    render: (text) => formatDateTime(new Date(text)),
  },
];
