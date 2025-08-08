import { formatDateTime } from "@/lib/date-n-time";
import { ReportItem } from "@/types/report";
import { Tag } from "antd";
import { ColumnsType } from "antd/es/table";
import ActionMenu from "./action-menu";

export const getReceivedReportColumns = (onRefresh?: () => void): ColumnsType<ReportItem> => [
  {
    title: "NO",
    dataIndex: "no",
    key: "no",
    render: (_, __, index) => index + 1,
  },
  {
    title: "Reporter",
    dataIndex: "reportingUser",
    key: "reportingUser.userName",
    render: (reportingUser: { userName: string }) => reportingUser.userName || "N/A",
  },
  {
    title: "Report Reason",
    dataIndex: "reportReason",
    key: "reportReason.name",
    render: (reportReason: { name: string }) => reportReason.name || "N/A",
  },
  {
    title: "Report Type",
    dataIndex: "reportReason",
    key: "reportReason.type",
    render: (reportReason: { type: string }) => reportReason.type || "N/A",
  },
  {
    title: "Message",
    dataIndex: "message",
    key: "message",
  },
  //   {
  //     title: "Game Name",
  //     dataIndex: "game",
  //     key: "game.name",
  //     render: (game: { name: string }) => game.name || "N/A",
  //   },

  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: (status: string) => (
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
    title: "Response",
    dataIndex: "reviewMessage",
    key: "reviewMessage",
    render: (text: string) => text || "-",
  },
  {
    title: "Created At",
    dataIndex: "createdAt",
    key: "createdAt",
    render: (text: string) => formatDateTime(new Date(text)),
  },
  {
    title: "Handle Date",
    dataIndex: "updatedAt",
    key: "updatedAt",
    render: (text: string) => formatDateTime(new Date(text)),
  },
  {
    title: "Action",
    key: "action",
    render: (_, record: ReportItem) => <ActionMenu record={record} onSuccess={onRefresh} />,
  },
];
