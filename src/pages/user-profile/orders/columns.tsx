// columns.tsx
import { formatDateTime } from "@/lib/date-n-time";
import { ColumnsType } from "antd/es/table";

export interface ReportItem {
  id: string;
  title: string;
  type: string;
  createdAt: string;
  status: string;
}

export const reportColumns: ColumnsType<ReportItem> = [
  {
    title: "No",
    dataIndex: "no",
    key: "no",
    width: 50,
    render: (_, __, index) => index + 1,
  },
  {
    title: "Order Code",
    dataIndex: "orderCode",
    key: "orderCode",
    render: (orderCode: string) => <span className="font-mono text-blue-400">OD-{orderCode}</span>,
  },
  {
    title: "Game name",
    dataIndex: "title",
    key: "title",
  },
  {
    title: "Type",
    dataIndex: "type",
    key: "type",
  },

  {
    title: "Price",
    dataIndex: "price",
    key: "price",
  },
  {
    title: "Discount",
    dataIndex: "discount",
    key: "discount",
  },
  {
    title: "Price After Discount",
    dataIndex: "priceAfterDiscount",
    key: "priceAfterDiscount",
  },
  {
    title: "Donation",
    dataIndex: "donation",
    key: "donation",
  },
  {
    title: "Commercial Package ",
    dataIndex: "commercialPackage",
    key: "commercialPackage",
  },
  {
    title: "Payment Method",
    dataIndex: "paymentMethod",
    key: "paymentMethod",
  },

  {
    title: "Status",
    dataIndex: "status",
    key: "status",
  },

  {
    title: "Created At",
    dataIndex: "createdAt",
    key: "createdAt",
    render: (text) => formatDateTime(new Date(text)),
  },
];
