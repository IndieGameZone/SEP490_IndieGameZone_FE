// columns.tsx
import { formatCurrencyVND } from "@/lib/currency";
import { formatDateTime } from "@/lib/date-n-time";
import { Order } from "@/types/order";
import { Button, Tooltip } from "antd";
import { ColumnsType } from "antd/es/table";
import { FaEye } from "react-icons/fa";
import { RiResetLeftFill } from "react-icons/ri";
import { Link } from "react-router-dom";

export const getColumns = (
  setSelectedOrder: (orderId: string) => void,
  onResetKey: (gameId: string) => void
): ColumnsType<Order> => {
  return [
    {
      title: "No",
      dataIndex: "no",
      key: "no",
      width: 50,
      render: (_, __, index) => index + 1,
    },
    {
      title: "Order Code",
      dataIndex: "id",
      key: "id",
      render: (_, record) => <span className="font-mono text-blue-400">{record.transaction.orderCode}</span>,
    },
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
                <span className="font-bold text-orange-500 hover:text-orange-400">"{record.game.name}"</span>
              </Link>{" "}
            </p>
          );
        }
        return (
          <p>
            Purchase{" "}
            <Link to={`/game/${record.game.id}`}>
              <span className="font-bold text-orange-500 hover:text-orange-400">"{record.game.name}"</span>
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
        return <span>{formatCurrencyVND(value)}</span>;
      },
    },
    {
      title: "Ordered At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text) => formatDateTime(new Date(text)),
    },
    {
      title: "Game Active Key",
      dataIndex: "activationKey",
      key: "activationKey",
      render: (activationKey) => (
        <span className={`font-mono ${activationKey?.isUsed ? "text-red-500" : "text-green-500"}`}>
          {activationKey?.key || ""}
        </span>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => {
        return (
          <div className="flex items-center gap-2">
            <Tooltip placement="top" title={"View Order Details"}>
              <Button icon={<FaEye />} shape="circle" onClick={() => setSelectedOrder(record.id)} />
            </Tooltip>
            <Tooltip placement="top" title={"Reset Key"}>
              <Button
                icon={<RiResetLeftFill />}
                shape="circle"
                className="hover:text-red-500"
                onClick={() => onResetKey(record.game.id)}
              />{" "}
            </Tooltip>
          </div>
        );
      },
    },
  ];
};
