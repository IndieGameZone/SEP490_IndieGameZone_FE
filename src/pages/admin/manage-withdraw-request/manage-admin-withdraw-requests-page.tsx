import { useCallback, useEffect, useState } from "react";
import { Table, Typography } from "antd";
import useAuthStore from "@/store/use-auth-store";
import { Withdraw } from "@/types/withdraw-request";
import { getAllWithdrawRequests } from "@/lib/api/withdraw-api";
import { useGlobalMessage } from "@/components/message-provider";
import { getWithdrawRequestColumns } from "./columns";

const { Title } = Typography;

const AdminWithdrawalRequestsPage: React.FC = () => {
  const [withdrawRequests, setWithdrawRequests] = useState<Withdraw[]>([]);
  const { profile } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const messageApi = useGlobalMessage();

  const fetchAdminWithdrawRequests = useCallback(async () => {
    setLoading(true);
    try {
      if (!profile) return;
      const response = await getAllWithdrawRequests();
      if (response.success) {
        setWithdrawRequests(response.data);
      } else {
        messageApi.error("Failed to fetch withdraw requests");
      }
    } catch (error) {
      messageApi.error("Error fetching withdraw requests");
    } finally {
      setLoading(false);
    }
  }, [profile, messageApi]);

  useEffect(() => {
    fetchAdminWithdrawRequests();
  }, [fetchAdminWithdrawRequests]);

  return (
    <>
      <div className="flex justify-center">
        <Title level={2}>Manage All Withdraw Requests</Title>
      </div>

      <div className="container mx-auto md:px-4">
        <Table
          dataSource={withdrawRequests}
          columns={getWithdrawRequestColumns(fetchAdminWithdrawRequests)} // Truyền callback
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
