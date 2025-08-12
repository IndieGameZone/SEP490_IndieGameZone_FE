// columns.tsx
import { formatCurrencyVND } from "@/lib/currency";
import { formatDateTime } from "@/lib/date-n-time";
import { Order } from "@/types/order";
import { ColumnsType } from "antd/es/table";
import { Link } from "react-router-dom";

export const reportColumns: ColumnsType<Order> = [
  {
    title: "No",
    dataIndex: "no",
    key: "no",
    width: 50,
    render: (_, __, index) => index + 1,
  },
  // {
  //   title: "Order Code",
  //   dataIndex: "orderCode",
  //   key: "orderCode",
  //   render: (_, __, index) => (
  //     <span className="font-mono text-blue-400">OD-{index}</span>
  //   ),
  // },
  {
    title: "Description",
    key: "description",
    render: (_, record) => {
      if (record.commercialPackage) {
        return (
          <p>
            Register{" "}
            <Link to={`/dev/commercial-package${record.commercialPackage.id}`}>
              <span className="font-bold text-orange-500 hover:text-orange-400">
                "{record.commercialPackage.name}"
              </span>
            </Link>{" "}
            for{" "}
            <Link to={`/dev/game/${record.game.id}`}>
              <span className="font-bold text-orange-500 hover:text-orange-400">
                "{record.game.name}"
              </span>
            </Link>{" "}
          </p>
        );
      }
      return (
        <p>
          Purchase {" "}
          <Link to={`/game/${record.game.id}`}>
            <span className="font-bold text-orange-500 hover:text-orange-400">
              "{record.game.name}"
            </span>
          </Link>{" "}
        </p>
      );
    },
  },
  {
    title: "Total",
    dataIndex: "amount",
    key: "amount",
    render: (value) => {
      return <span>{formatCurrencyVND(value)}</span>
    }
  },
  {
    title: "Ordered At",
    dataIndex: "createdAt",
    key: "createdAt",
    render: (text) => formatDateTime(new Date(text)),
  },
];
