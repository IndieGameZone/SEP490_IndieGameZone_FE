// columns.tsx
import { formatDateTime } from "@/lib/date-n-time";
import { Withdraw } from "@/types/withdraw-request";
import { Image, Tag } from "antd";
import { ColumnsType } from "antd/es/table";
import ActionMenu from "./action-menu";

export const getWithdrawRequestColumns = (
  onRefresh?: () => void
): ColumnsType<Withdraw> => [
  {
    title: "ID",
    dataIndex: "id",
    key: "id",
    width: 100,
  },
  {
    title: "Requester ",
    dataIndex: "user",
    key: "user.fullname",
    render: (user: { fullname: string }) => user.fullname || "N/A",
  },

  {
    title: "Amount",
    dataIndex: "amount",
    key: "amount",
    render: (amount: number) => `${amount?.toLocaleString()} VND`,
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: (status: string) => (
      <Tag
        color={
          status === "Approved"
            ? "green"
            : status === "Rejected"
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
    title: "Image Proof",
    dataIndex: "imageProof",
    key: "imageProof",
    render: (imageProof: string) =>
      imageProof ? (
        <Image
          src={imageProof}
          alt="Proof"
          className="object-cover rounded"
          style={{
            width: "4rem",
            height: "4rem",
          }}
        />
      ) : (
        <span className="text-gray-400">No image</span>
      ),
  },
  {
    title: "Reject Reason",
    dataIndex: "rejectReason",
    key: "rejectReason",
    render: (text: string) => text || "-",
  },
  {
    title: "Created At",
    dataIndex: "createdAt",
    key: "createdAt",
    render: (text: string) => formatDateTime(new Date(text)),
  },
  {
    title: "Handled Date",
    dataIndex: "handledAt",
    key: "handledAt",
    render: (text: string) => formatDateTime(new Date(text)),
  },
  {
    title: "Action",
    key: "action",
    render: (_, record: Withdraw) => (
      <ActionMenu record={record} onSuccess={onRefresh} />
    ),
  },
];
