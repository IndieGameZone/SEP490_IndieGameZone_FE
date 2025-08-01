import {  useEffect, useState } from "react";
import {  Table, Typography } from "antd";
import { withdrawRequestColumns } from "./columns";
import useAuthStore from "@/store/use-auth-store";
import { Withdraw } from "@/types/withdraw-request";
import { getAllWithdrawRequests } from "@/lib/api/withdraw-api";
import { useGlobalMessage } from "@/components/message-provider";

const { Title } = Typography;

const AdminWithdrawalRequestsPage: React.FC = () => {
  const [withdrawRequests, setWithdrawRequests] = useState<Withdraw[]>([]);
  const { profile } = useAuthStore();
  const [loading, setLoading] = useState(true);
    const messageApi = useGlobalMessage();
  
  useEffect(() => {
    const fetchAdminWithdrawRequests = async () => {
      setLoading(true);
      try {
        if (!profile) return;
        const response = await getAllWithdrawRequests();
        if (response.success) {
          setWithdrawRequests(response.data);
          messageApi.success("Withdraw requests fetched successfully!");
        } else {
          messageApi.error("Failed to fetch withdraw requests");
        }
      } catch (error) {
        messageApi.error("Error fetching withdraw requests");
      } finally {
        setLoading(false);
      }
    };

    fetchAdminWithdrawRequests();
  }, []);
  return (
    <>
      <div className="flex justify-center py-5">
        <Title level={2}>Manage All Withdraw Requests</Title>
      </div>

      <div className="container mx-auto px-4">
        <Table
          dataSource={withdrawRequests}
          columns={withdrawRequestColumns}
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

export default AdminWithdrawalRequestsPage;
