import React, { useCallback, useEffect, useState } from "react";
import { Table, Typography, Spin } from "antd";
import { ReportItem } from "@/types/report";
import { reportColumns } from "./columns";
import { useGlobalMessage } from "@/components/message-provider";
import { getReportByReported } from "@/lib/api/report-api";
import useAuthStore from "@/store/use-auth-store";

const { Title } = Typography;

const ManageReceivedReportPage: React.FC = () => {
  const [reports, setReports] = useState<ReportItem[]>([]);

  const { profile } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const messageApi = useGlobalMessage();

  const fetchReceivedReports = useCallback(async () => {
    setLoading(true);
    try {
      if (!profile) return;
      const response = await getReportByReported(profile.id);
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
    fetchReceivedReports();
  }, [fetchReceivedReports]);

  return (
    <>
      <div className="flex justify-center py-5">
        <Title level={2}>Manage Received Reports</Title>
      </div>
      <div className="container mx-auto md:px-4">
        <Table
          dataSource={reports}
          columns={reportColumns}
          scroll={{ x: "max-content" }}
          loading={loading}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </div>
    </>
  );
};

export default ManageReceivedReportPage;
