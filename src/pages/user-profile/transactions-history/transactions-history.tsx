import { Transaction } from "@/types/transaction";
import { Card, Table } from "antd";
import { useState } from "react";
import { FaHistory } from "react-icons/fa";
import { columns } from "./columns";

const transactionsData: Transaction[] = [
  {
    id: "TXN001",
    type: "topup",
    amount: 50000,
    description: "Bank transfer top-up",
    status: "completed",
    date: "2024-06-27 14:30:00",
    method: "bank_transfer",
  },
  {
    id: "TXN002",
    type: "purchase",
    amount: -15000,
    description: "React Advanced Course Purchase",
    status: "completed",
    date: "2024-06-26 09:15:00",
    method: "points",
  },
  {
    id: "TXN003",
    type: "topup",
    amount: 30000,
    description: "E-wallet top-up",
    status: "pending",
    date: "2024-06-25 16:45:00",
    method: "ewallet",
  },
  {
    id: "TXN004",
    type: "purchase",
    amount: -8000,
    description: "Learning materials purchase",
    status: "completed",
    date: "2024-06-24 11:20:00",
    method: "points",
  },
];

const TransactionHistory = () => {
  const [transactions] = useState<Transaction[]>(transactionsData);

  return (
    <Card
      title={
        <h2 className="font-bold flex items-center">
          <FaHistory className="inline me-2" />
          <span>Transaction History</span>
        </h2>
      }
    >
      <Table<Transaction>
        columns={columns}
        dataSource={transactions}
        rowKey="id"
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} transactions`,
        }}
        scroll={{ x: 1000 }}
      />
    </Card>
  );
};

export default TransactionHistory;
