import React, { useCallback, useEffect, useState } from "react";
import { Table, Typography, message } from "antd";
import {
  getCommercialPackagesRegistrationsByUserId,
} from "@/lib/api/commercial-package-api";
import { CommercialPackage } from "@/types/commercial-package";
import useAuthStore from "@/store/use-auth-store";
import { getCommercialRegistrationColumns } from "./columns";

const { Title } = Typography;

const DevCommercialPackageRegistrations: React.FC = () => {
  const [commercialPackages, setCommercialPackages] = useState<CommercialPackage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [messageApi, contextHolder] = message.useMessage();
  const { profile } = useAuthStore();

  const fetchCommercialPackagesByUserId = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getCommercialPackagesRegistrationsByUserId(profile?.id || "");
      if (response.error) {
        throw new Error(response.error);
      }
      setCommercialPackages(response.data);
    } catch (error) {
      console.error("Failed to fetch reports:", error);
      messageApi.error("Failed to fetch reports");
    } finally {
      setLoading(false);
    }
  }, [messageApi, profile?.id]);

  useEffect(() => {
    if (profile?.id) {
      fetchCommercialPackagesByUserId();
    }
  }, [fetchCommercialPackagesByUserId, profile?.id]);

  return (
    <>
      {contextHolder}
      <div className="flex justify-center mb-6">
        <Title level={2}>Manage Commercial Packages Registrations</Title>
      </div>
      <div>
        <Table
          dataSource={commercialPackages}
          columns={getCommercialRegistrationColumns(fetchCommercialPackagesByUserId)}
          rowKey="id"
          loading={loading}
          scroll={{ x: "max-content" }}
          pagination={{ pageSize: 5 }}
        />
      </div>
    </>
  );
};

export default DevCommercialPackageRegistrations;