// columns.tsx
import { formatCurrencyVND } from "@/lib/currency";
import { CommercialPackage } from "@/types/commercial-package";
import { Badge } from "antd";
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
    render: (price: number) => formatCurrencyVND(price),
  },

  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: (status: string) => {
      let badgeStatus:
        | "default"
        | "success"
        | "processing"
        | "error"
        | "warning" = "default";
      switch (status.toLowerCase()) {
        case "pending":
          badgeStatus = "processing";
          break;
        case "active":
          badgeStatus = "success";
          break;
        case "expired":
          badgeStatus = "warning";
          break;
        case "cancelled":
          badgeStatus = "default";
          break;
        case "failed":
          badgeStatus = "error";
          break;
      }
      return <Badge status={badgeStatus} text={status} />;
    },
    width: 100,
  },
  {
    title: "Start Date",
    dataIndex: "startDate",
    key: "startDate",
    render: (value) => {
      return new Date(value).toDateString();
    },
  },
  {
    title: "End Date",
    dataIndex: "endDate",
    key: "endDate",
    render: (value) => {
      return new Date(value).toDateString();
    },
  },
];
