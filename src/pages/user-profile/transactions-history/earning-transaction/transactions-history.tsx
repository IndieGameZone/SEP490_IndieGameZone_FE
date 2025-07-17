import { Transaction } from "@/types/transaction";
import { Card, Table } from "antd";
import { useState, useEffect } from "react";
import { columns } from "./columns";
import useAuthStore from "@/store/use-auth-store";
import { getTransactionsEarning } from "@/lib/api/payment-api";

const EarningTransactionHistory = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const { profile } = useAuthStore();

  useEffect(() => {
    const loadTransactions = async () => {
      if (profile?.id) {
        const response = await getTransactionsEarning(profile.id);
        if (response.success) {
          const mappedTransactions = response.data.map((item: any) => ({
            id: item.id,
            orderCode: item.orderCode,
            type: item.type.toLowerCase(),
            amount: item.amount,
            paymentMethod: item.paymentMethod,
            description: item.description,
            date: item.createdAt,
            status: item.status as Transaction["status"],
          }));
          setTransactions(mappedTransactions);
        }
      }
    };
    loadTransactions();
  }, [profile]);

  return (
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
  );
};

export default EarningTransactionHistory;
