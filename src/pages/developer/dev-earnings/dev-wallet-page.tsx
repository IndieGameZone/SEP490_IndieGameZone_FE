import React, { useCallback, useEffect, useState } from "react";
import { Button, Table } from "antd";
import { withdrawRequestColumns } from "./withdraw-request/columns";
import useAuthStore from "@/store/use-auth-store";
import { Withdraw } from "@/types/withdraw-request";
import { getWithdrawRequestById } from "@/lib/api/withdraw-api";
import CreateWithdrawRequest from "./withdraw-request/create-withdraw-request";
import { PiHandWithdraw } from "react-icons/pi";
import DevWallet from "./wallet/dev-wallet";

const DevWalletPage: React.FC = () => {
  const [withdrawRequests, setWithdrawRequests] = useState<Withdraw[]>([]);
  const { profile } = useAuthStore();
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const fetchWithdrawRequests = useCallback(async () => {
    setLoading(true);
    try {
      if (!profile) return;
      const response = await getWithdrawRequestById(profile.id);
      if (response.success) {
        setWithdrawRequests(response.data);
      } else {
        console.error("Failed to fetch withdraw requests:", response.error);
      }
    } catch (error) {
      console.error("Error fetching withdraw requests:", error);
    } finally {
      setLoading(false);
    }
  }, [profile]);

  useEffect(() => {
    fetchWithdrawRequests();
  }, [fetchWithdrawRequests]);

  return (
    <div className="bg-zinc-900">
      <DevWallet />
      <div className="flex justify-between items-center m-4">
        <div className="flex items-center gap-2">
          <p className="font-semibold text-2xl"> Withdraw Request History</p>
        </div>

        <Button
          type="primary"
          onClick={() => setAddModalOpen(true)}
          icon={<PiHandWithdraw />}
        >
          Request Withdraw
        </Button>
      </div>
      <CreateWithdrawRequest
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSuccess={fetchWithdrawRequests}
      />

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

export default DevWalletPage;
