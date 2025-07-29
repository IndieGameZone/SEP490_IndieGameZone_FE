// columns.tsx
import { CommercialPackage } from "@/types/commercial-package";
import { Tag } from "antd";
import { ColumnsType } from "antd/es/table";

export const reportColumns: ColumnsType<CommercialPackage> = [
  {
    title: "Developer Name",
    dataIndex: "developer",
    key: "developer.userName",
    render: (developer: { userName: string }) => developer.userName || "N/A",
  },
  {
    title: "Game Name",
    dataIndex: "gameName",
    key: "gameName",
    render: (name: string) => name || "N/A",
  },
  {
    title: "Commercial Package Name",
    dataIndex: "commercialPackageName",
    key: "commercialPackageName",
    render: (name: string) => name || "N/A",
  },
  
  {
    title: "Duration (days)",
    dataIndex: "duration",
    key: "duration",
  },
  {
    title: "Price ",
    dataIndex: "price",
    key: "price",
  },

  {
  title: "Status",
  dataIndex: "status",
  key: "status",
  render: (status: string) => {
    let color = "default";
    switch (status.toLowerCase()) {
      case "pending":
        color = "blue";
        break;
      case "active":
        color = "green";
        break;
      case "expired":
        color = "red";
        break;
      case "cancelled":
        color = "orange";
        break;
      case "failed":
        color = "volcano";
        break;
    }
    return <Tag color={color}>{status}</Tag>;
  },
},
  {
    title: "Start Date",
    dataIndex: "startDate",
    key: "startDate",
  },
  {
    title: "End Date",
    dataIndex: "endDate",
    key: "endDate",
  },
];
