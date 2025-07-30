import React, { useEffect, useState } from "react";
import { Table, Typography, Spin } from "antd";
import type { ReportItem } from "./columns";
import { reportColumns } from "./columns";
import { getOrderByUserId } from "@/lib/api/payment-api";
import useAuthStore from "@/store/use-auth-store";

const { Title } = Typography;

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
    <>
      <div className="flex justify-center py-5">
        <Title level={2}>Manage Orders</Title>
      </div>
      <div className="container mx-auto px-4">
        <Table
          dataSource={orders}
          columns={reportColumns}
          loading={loading}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} Orders`,
          }}
          scroll={{ x: "max-content" }}
          bordered
        />
      </div>
    </>
  );
};

export default UserOrdersPage;
