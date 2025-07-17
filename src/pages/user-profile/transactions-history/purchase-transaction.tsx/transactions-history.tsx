import { Transaction } from "@/types/transaction";
import { Table } from "antd";
import { useState, useEffect } from "react";
import { columns } from "./columns";
import useAuthStore from "@/store/use-auth-store";
import { getTransactionsPurchase } from "@/lib/api/payment-api";

const PurchaseTransactionHistory = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const { profile } = useAuthStore();

  useEffect(() => {
    const loadTransactions = async () => {
      if (profile?.id) {
        const response = await getTransactionsPurchase(profile.id);
        if (response.success) {
          const mappedTransactions = response.data.map(
            (item: any): Transaction => {
              const gamePrice = Number(item.game?.price ?? 0);
              const amount = Number(item.amount ?? 0);
              const donation =
                item.type === "PurchaseGame" ? amount - gamePrice : 0;

              return {
                id: item.id,
                orderCode: item.orderCode,
                type: item.type,
                amount,
                gamePrice,
                donation,
                paymentMethod: item.paymentMethod,
                description: item.description,
                createdAt: item.createdAt,
                status: item.status,
              };
            }
          );

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
        showTotal: (total, range) =>
          `${range[0]}-${range[1]} of ${total} transactions`,
      }}
      scroll={{ x: "max-content" }}
    />
  );
};

export default PurchaseTransactionHistory;
