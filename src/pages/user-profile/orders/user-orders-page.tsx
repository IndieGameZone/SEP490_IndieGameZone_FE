import React, { useEffect, useState } from "react";
import { Table } from "antd";
import type { ReportItem } from "./columns";
import { reportColumns } from "./columns";
import { getOrderByUserId } from "@/lib/api/payment-api";
import useAuthStore from "@/store/use-auth-store";

const UserOrdersPage: React.FC = () => {
  const [orders, setReports] = useState<ReportItem[]>([]);
  const { profile } = useAuthStore();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        if (!profile) return;
        const response = await getOrderByUserId(profile.id);
        if (response.success) {
          setReports(response.data);
        } else {
          console.error("Failed to fetch orders:", response.error);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [profile]);

  return (
    <div className="p-5">
      <h2 className="text-xl font-semibold">Order History</h2>
      <p className="text-sm text-zinc-400">
        Browse your full order history including digital purchases and
        donations.
      </p>
      <div className="mt-5">
        <Table
          dataSource={orders}
          columns={reportColumns}
          loading={loading}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} Orders`,
          }}
          scroll={{ x: "max-content" }}
          bordered
        />
      </div>
    </div>
  );
};

export default UserOrdersPage;
