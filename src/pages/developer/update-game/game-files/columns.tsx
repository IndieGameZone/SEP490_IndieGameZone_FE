import { formatMegabytes } from "@/lib/file";
import { GameFile } from "@/types/game";
import { TableProps } from "antd";

export const columns: TableProps<GameFile>["columns"] = [
  {
    title: "Display name",
    dataIndex: "displayName",
    key: "displayName",
  },
  {
    title: "File size",
    dataIndex: "size",
    key: "size",
    render: (_, { size }) => <span>{formatMegabytes(size)}</span>,
  },
  {
    title: "Platform",
    key: "platform",
    dataIndex: "platform",
    render: (_, { platform }) => <span>{platform.name}</span>,
  },
  {
    title: "Action",
    key: "action",
    render: (_, record) => (
      <div>
        <a>Invite {record.displayName}</a>
        <a>Delete</a>
      </div>
    ),
  },
];
