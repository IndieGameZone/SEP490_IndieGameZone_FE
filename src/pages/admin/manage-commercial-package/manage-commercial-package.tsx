// manage-report-page.tsx
import React, { useCallback, useEffect, useState } from "react";
import { Table, Typography, message } from "antd";
import { reportColumns } from "./columns";
import { getAllCommercialPackagesRegistrations } from "@/lib/api/commercial-package-api";
import { CommercialPackage } from "@/types/commercial-package";

const { Title } = Typography;

const ManageCommercialPackage: React.FC = () => {
  const [commercialPackages, setCommercialPackages] = useState<CommercialPackage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [messageApi, contextHolder] = message.useMessage();

  const fetchCommercialPackages = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getAllCommercialPackagesRegistrations();
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
  }, [messageApi]);

  useEffect(() => {
    fetchCommercialPackages();
  }, [fetchCommercialPackages]);
  return (
    <>
      {contextHolder}
      <div className="flex justify-center mb-6">
        <Title level={2}>Manage Commercial Packages Registrations</Title>
      </div>
      <div>
        <Table
          dataSource={commercialPackages}
          columns={reportColumns(fetchCommercialPackages)}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 5 }}
          scroll={{ x: "max-content" }}
        />
      </div>
    </>
  );
};

export default ManageCommercialPackage;
