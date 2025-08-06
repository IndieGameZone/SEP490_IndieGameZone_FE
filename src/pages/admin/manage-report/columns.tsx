import { formatDateTime } from "@/lib/date-n-time";
import { ReportItem } from "@/types/report";
import { ReportReason } from "@/types/report-reason";
import { User } from "@/types/user";
import { Tag } from "antd";
import { ColumnsType } from "antd/es/table";
import ActionMenu from "./action-menu";

export const getAllReportColumns = (
  onRefresh?: () => void
): ColumnsType<ReportItem> => [
  {
    title: "No",
    dataIndex: "no",
    key: "no",
    render: (_, __, index) => index + 1,
    width: 55,
  },
  {
    title: "Reporter",
    dataIndex: "reportingUser",
    key: "reportingUser",
    render: (reportingUser: User | undefined) =>
      reportingUser?.userName ?? "N/A",
    width: 120,
  },
  {
    title: "Report Reason",
    dataIndex: "reportReason",
    key: "reportReason",
    render: (reportReason: ReportReason | undefined) =>
      reportReason?.name ?? "N/A",
    width: 150,
  },
  {
    title: "Message",
    dataIndex: "message",
    key: "message",
    ellipsis: true,
  },
  {
    title: "Report Type",
    dataIndex: "reportReason",
    key: "reportReason.type",
    render: (reportReason: { type: string } | undefined) =>
      reportReason?.type ?? "N/A",
    width: 120,
  },
  {
    title: "Game Name",
    dataIndex: "game",
    key: "game.name",
    render: (game: { name: string } | undefined) => game?.name ?? "N/A",
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
    title: "Response",
    dataIndex: "reviewMessage",
    key: "reviewMessage",
    render: (text: string) => text || "-",
  },
  {
    title: "Created At",
    dataIndex: "createdAt",
    key: "createdAt",
    width: 150,
    render: (date: string) => (
      <div className="text-sm text-gray-600">
        {formatDateTime(new Date(date))}
      </div>
    ),
  },
  {
    title: "Updated At",
    dataIndex: "updatedAt",
    key: "updatedAt",
    width: 150,
    render: (date: string) => (
      <div className="text-sm text-gray-600">
        {formatDateTime(new Date(date))}
      </div>
    ),
  },
  {
    title: "Action",
    key: "action",
    render: (_, record: ReportItem) => (
      <ActionMenu record={record} onSuccess={onRefresh} />
    ),
  },
];
