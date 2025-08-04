import { Transaction } from "@/types/transaction";
import { Table } from "antd";
import { useState, useEffect } from "react";
import { getAllTransactions } from "@/lib/api/payment-api";
import { getAllTransactionColumns } from "./columns";

const ManageAllTransaction = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchAllTransactions = async () => {
      setLoading(true);
      try {
        const response = await getAllTransactions();
        if (response.success) {
          setTransactions(response.data);
        }
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAllTransactions();
  }, []);

  return (
    <Table
      dataSource={transactions}
      columns={getAllTransactionColumns((ManageAllTransaction) )}
      rowKey="id"
      loading={loading}
      bordered
      scroll={{ x: "max-content" }}
      pagination={{
        pageSize: 10,
        showSizeChanger: true,
        showTotal: (total) => `Total ${total} items`,
      }}
    />
  );
};

export default ManageAllTransaction;
