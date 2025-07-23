import { formatMegabytes } from "@/lib/file";
import { GameFile } from "@/types/game";
import { Badge, TableProps } from "antd";
import ToggleVisibilityButton from "./toggle-visibility-button";
import DownloadFileButton from "@/components/buttons/download-file-button";

export const columns: TableProps<GameFile>["columns"] = [
  {
    title: "ID",
    dataIndex: "id",
    key: "id",
    hidden: true,
  },
  {
    title: "Display name",
    dataIndex: "displayName",
    key: "displayName",
  },
  {
    title: "Version",
    dataIndex: "version",
    key: "version",
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
    title: "Visibility",
    key: "isActive",
    dataIndex: "isActive",
    render: (_, { isActive }) => (
      <Badge
        status={isActive ? "success" : "default"}
        text={isActive ? "Shown" : "Hidden"}
      ></Badge>
    ),
  },
  {
    title: "Action",
    key: "action",
    render: (_, record) => (
      <div className="flex gap-2">
        <ToggleVisibilityButton file={record} />
        <DownloadFileButton file={record} />
      </div>
    ),
  },
];
