import { formatDateTime } from "@/lib/date-n-time";
import { GamePost } from "@/types/game-post";
import { Tag } from "antd";
import { ColumnsType } from "antd/es/table";
import ActionMenu from "./action-menu";

// Export the function to make it reusable
export const getStatusBadge = (status: string) => {
  let color = "default";
  let text = status;

  switch (status.toLowerCase()) {
    case "approved":
      color = "success";
      text = "Approved";
      break;
    case "pendingaireview":
      color = "processing";
      text = "Pending AI Review";
      break;
    case "pendingmanualreview":
      color = "warning";
      text = "Pending Manual Review";
      break;
    case "rejected":
      color = "error";
      text = "Rejected";
      break;
    default:
      color = "default";
      text = status;
  }

  return { color, text };
};

export const getAllPostColumns = (
  onRefresh?: () => void, 
  onViewDetail?: (postId: string) => void
): ColumnsType<GamePost> => [
  {
    title: "No",
    dataIndex: "no",
    key: "no",
    render: (_, __, index) => index + 1,
    width: 55,
  },
  {
    title: "Post by",
    dataIndex: "user",
    key: "user",
    render: (user: { userName?: string }) => user?.userName ?? "N/A",
    width: 120,
  },
  {
    title: "Title",
    dataIndex: "title",
    key: "title",
    render: (title: string) => title || "No title",
    ellipsis: true,
  },
  {
    title: "Game Name",
    dataIndex: "game",
    key: "game",
    render: (game: { name?: string }) => game?.name ?? "N/A",
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: (status: string) => {
      const badgeProps = getStatusBadge(status);
      return <Tag color={badgeProps.color}>{badgeProps.text || "Unknown"}</Tag>;
    },
  },
  {
    title: "Created At",
    dataIndex: "createdAt",
    key: "createdAt",
    width: 150,
    render: (date: string) => <div className="text-sm text-gray-600">{formatDateTime(new Date(date))}</div>,
  },
  {
    title: "Action",
    key: "action",
    render: (_, record: GamePost) => (
      <ActionMenu 
        record={record} 
        onSuccess={onRefresh}
        onViewDetail={onViewDetail}
      />
    ),
  },
];