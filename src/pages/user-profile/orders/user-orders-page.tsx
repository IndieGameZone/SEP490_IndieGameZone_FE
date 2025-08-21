import React, { useEffect, useRef, useState } from "react";
import { Table } from "antd";
import useAuthStore from "@/store/use-auth-store";
import { Order } from "@/types/order";
import { getOrderByUserId } from "@/lib/api/order-api";
import OrderDetailsModal from "./order-details-modal";
import { getColumns } from "./columns";
import { useGlobalMessage } from "@/components/message-provider";
import { resetGameKey } from "@/lib/api/order-api";
const UserOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const { profile } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const selectedOrder = useRef<string | null>(null);
  const [orderDetailsOpen, setOrderDetailsOpen] = useState(false);
  const messageApi = useGlobalMessage();

  const openOrderDetail = (orderId: string) => {
    selectedOrder.current = orderId;
    setOrderDetailsOpen(true);
  };

  const closeOrderDetail = () => {
    selectedOrder.current = null;
    setOrderDetailsOpen(false);
  };

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        if (!profile) return;
        const response = await getOrderByUserId(profile.id);
        if (response.success) {
          setOrders(response.data);
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
  const handleResetKey = async (userId: string, gameId: string) => {
    try {
      const result = await resetGameKey(userId, gameId);
      if (result.success) {
        messageApi.success("Game key has been reset successfully!");
        const response = await getOrderByUserId(profile!.id);
        if (response.success) {
          setOrders(response.data);
        }
      } else {
        messageApi.error(result.error || "Failed to reset game key");
      }
    } catch (error) {
      messageApi.error("An error occurred while resetting the game key");
    }
  };
  return (
    <div className="p-5">
      <OrderDetailsModal open={orderDetailsOpen} orderId={selectedOrder.current} handleCancel={closeOrderDetail} />
      <h2 className="text-xl font-semibold">Order History</h2>
      <p className="text-sm text-zinc-400">Browse your full order history including digital purchases and donations.</p>
      <div className="mt-5">
        <Table
          dataSource={orders}
          columns={getColumns(openOrderDetail, (gameId) => handleResetKey(profile!.id, gameId))}
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
    </div>
  );
};

export default UserOrdersPage;
