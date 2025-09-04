import { useEffect, useRef, useState } from "react";
import { Table } from "antd";
import { Order } from "@/types/order";
import { getAllOrders } from "@/lib/api/order-api";
import OrderDetailsModal from "./order-details-modal";
import { getColumns } from "./columns";
import { useFilters } from "@/hooks/use-filters";

type OrderFilter = {
  page: number;
  pageSize: number;
};
const ManageOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const selectedOrder = useRef<string | null>(null);
  const [orderDetailsOpen, setOrderDetailsOpen] = useState(false);

  const openOrderDetail = (orderId: string) => {
    selectedOrder.current = orderId;
    setOrderDetailsOpen(true);
  };

  const closeOrderDetail = () => {
    selectedOrder.current = null;
    setOrderDetailsOpen(false);
  };

  const { filters, setFilters } = useFilters<OrderFilter>({
    page: 1,
    pageSize: 10,
  });

  const [pagination, setPagination] = useState<{
    totalCount: number;
    currentPage: number;
    pageSize: number;
  }>({
    totalCount: 0,
    currentPage: 1,
    pageSize: 10,
  });

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const response = await getAllOrders({
          PageNumber: filters.page,
          PageSize: filters.pageSize,
        });
        if (!response.error) {
          setOrders(response.data);
          const paginationHeader = response.headers["x-pagination"];
          const pagination = paginationHeader
            ? JSON.parse(paginationHeader)
            : null;
          setPagination({
            currentPage: pagination.CurrentPage,
            pageSize: pagination.PageSize,
            totalCount: pagination.TotalCount,
          });
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
  }, [filters.page, filters.pageSize]);

  return (
    <div className="p-5">
      <OrderDetailsModal
        open={orderDetailsOpen}
        orderId={selectedOrder.current}
        handleCancel={closeOrderDetail}
      />
      <h2 className="text-xl font-semibold">Order System History</h2>
      <p className="text-sm text-zinc-400">
        Browse the system's entire order history including digital and
        Commercial Package purchases
      </p>
      <div className="mt-5">
        <Table
          dataSource={orders}
          columns={getColumns(openOrderDetail)}
          loading={loading}
          rowKey="id"
          pagination={{
            pageSize: pagination.pageSize,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (_, range) =>
              `${range[0]}-${range[1]} of ${pagination.totalCount} Orders`,
            current: pagination.currentPage,
            onChange(page, pageSize) {
              setFilters({
                page: page,
                pageSize: pageSize,
              });
            },
          }}
          scroll={{ x: "max-content" }}
          bordered
        />
      </div>
    </div>
  );
};

export default ManageOrders;
