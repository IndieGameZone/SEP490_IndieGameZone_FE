// columns.tsx
import { formatDateTime } from "@/lib/date-n-time";
import { Withdraw } from "@/types/withdraw-request";
import { Tag } from "antd";
import { ColumnsType } from "antd/es/table";
import ActionMenu from "./action-menu";

export const withdrawRequestColumns: ColumnsType<Withdraw> = [
  {
    title: "Withdraw Request ID",
    dataIndex: "id",
    key: "id",
  },
  {
    title: "Requester",
    dataIndex: "userId",
    key: "userId",
  },

  {
    title: "Amount",
    dataIndex: "amount",
    key: "amount",
  },

  {
    title: "Image Proof",
    dataIndex: "imageProof",
    key: "imageProof",
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: (status) => (
      <Tag
        color={
          status === "Approved" ? "green" : status === "Rejected" ? "red" : status === "Pending" ? "gold" : "default"
        }
      >
        {status || "Unknown"}
      </Tag>
    ),
  },
  {
    title: "Reject Reason",
    dataIndex: "rejectReason",
    key: "rejectReason",
    render: (text) => text || "",
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
  {
    title: "Action",
    key: "action",
    render: (_, record: Withdraw) => <ActionMenu record={record} />,
  }
];
