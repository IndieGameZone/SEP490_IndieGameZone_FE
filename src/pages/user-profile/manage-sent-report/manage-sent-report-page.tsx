import React, { useCallback, useEffect, useState } from "react";
import { Card, Select, Space, Table, Typography } from "antd";
import { ReportItem } from "@/types/report";
import { getSentReportColumns } from "./columns";
import { useGlobalMessage } from "@/components/message-provider";
import { getReportByReporting } from "@/lib/api/report-api";
import useAuthStore from "@/store/use-auth-store";

const { Title } = Typography;
const { Option } = Select;

const ManageSentReportPage: React.FC = () => {
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [reportType, setReportType] = useState<string>("Game");

  const { profile } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const messageApi = useGlobalMessage();

  const fetchReceivedReports = useCallback(async () => {
    setLoading(true);
    try {
      if (!profile) return;
      const response = await getReportByReporting(profile.id, reportType);
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
  }, [profile, messageApi,reportType]);

  useEffect(() => {
    fetchReceivedReports();
  }, [fetchReceivedReports]);
  const handleReportTypeChange = (value: string) => {
    setReportType(value);
  };
  return (
    <>
      <div className="flex justify-center py-5">
        <Title level={2}>Manage Sent Reports</Title>
      </div>
      <div className="container mx-auto md:px-4">
        <Card className="mb-4">
          <Space direction="vertical" size="middle" style={{ width: "100%" }}>
            <div>
              <label className="block mb-2 font-medium">Filter by Report Type:</label>
              <Select
                style={{ width: 200 }}
                placeholder="Select report type"
                onChange={handleReportTypeChange}
                allowClear
                defaultValue="Game"
              >
                <Option value="Game">Game</Option>
                <Option value="Review">Review</Option>
                <Option value="Comment">Comment</Option>
                <Option value="Post">Post</Option>
              </Select>
            </div>
          </Space>
        </Card>
        <Table
          dataSource={reports}
          columns={getSentReportColumns(fetchReceivedReports)}
          scroll={{ x: "max-content" }}
          loading={loading}
          rowKey="id"
          pagination={{ pageSize: 5 }}
        />
      </div>
    </>
  );
};

export default ManageSentReportPage;
