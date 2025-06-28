import { Transaction } from "@/types/transaction";
import { Card, Table } from "antd";
import { useState, useEffect } from "react";
import { FaHistory } from "react-icons/fa";
import { columns } from "./columns";
import useAuthStore from "@/store/use-auth-store";
import { getTransactions } from "@/lib/api/payment-api";

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const { profile, fetchProfile } = useAuthStore();

  useEffect(() => {
    const loadTransactions = async () => {
      if (profile?.id) {
        const response = await getTransactions(profile.id);
        if (response.success) {
          const mappedTransactions = response.data.map((item: any) => ({
            id: item.id,
            orderCode: item.orderCode,
            type: item.type.toLowerCase(),
            amount: item.amount,
            description: item.description,
            date: item.createdAt,
            status: item.status as Transaction["status"],
          }));
          setTransactions(mappedTransactions);
        }
      }
    };
    loadTransactions();
  }, [profile?.id, fetchProfile]);

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
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} transactions`,
        }}
        scroll={{ x: 1000 }}
      />
    </Card>
  );
};

export default TransactionHistory;
