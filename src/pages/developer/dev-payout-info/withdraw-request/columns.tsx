// columns.tsx
import { formatDateTime } from "@/lib/date-n-time";
import { Withdraw } from "@/types/withdraw-request";
import { ColumnsType } from "antd/es/table";
import { Image, Tag } from "antd";

export const withdrawRequestColumns: ColumnsType<Withdraw> = [
  {
    title: "No",
    dataIndex: "no",
    key: "no",

    width: 100,
    render: (_, __, index) => index + 1,
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
    render: (imageProof: string) =>
      imageProof ? <Image src={imageProof} alt="Proof" style={{ width: 100, height: 100 }} /> : <span>No image</span>,
  },
  {
    title: " Status",
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
    render: (rejectReason: string) => rejectReason || "-",
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
