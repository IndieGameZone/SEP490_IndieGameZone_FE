import { useCallback, useEffect, useState } from "react";
import { Table } from "antd";
import { useGlobalMessage } from "@/components/message-provider";
import useAuthStore from "@/store/use-auth-store";
import { getAdminWallet } from "@/lib/api/payment-api";
import { Transaction } from "@/types/transaction";
import { getAdminWalletColumns } from "./columns";
import AdminWallet from "./admin-wallet";
import DashboardSummary from "./dashboard-summary";

const ManageAdminWallet = () => {
  const [reports, setReports] = useState<Transaction[]>([]);

  const { profile } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const messageApi = useGlobalMessage();

  const fetchAdminTransactions = useCallback(async () => {
    setLoading(true);
    try {
      if (!profile) return;
      const response = await getAdminWallet(profile.id);
      if (response.success) {
        setReports(response.data);
      } else {
        messageApi.error("Failed to fetch reports");
      }
    } catch (error) {
      messageApi.error("Error fetching reports");
    } finally {
      setLoading(false);
    }
  }, [profile, messageApi]);

  useEffect(() => {
    fetchAdminTransactions();
  }, [fetchAdminTransactions]);

  return (
    <div>
      <h1 className="text-center text-3xl font-semibold mb-5">
        Admin Wallet
      </h1>
      <DashboardSummary />
      <AdminWallet />
      <div className="container">
        <Table
          dataSource={reports}
          columns={getAdminWalletColumns()}
          scroll={{ x: "max-content" }}
          loading={loading}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </div>
    </div>
  );
};

export default ManageAdminWallet;
