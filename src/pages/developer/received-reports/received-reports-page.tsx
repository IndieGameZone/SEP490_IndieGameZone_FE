import React, { useCallback, useEffect, useState } from "react";
import { Card, Select, Space, Table, Typography } from "antd";
import { ReportItem } from "@/types/report";
import { getReceivedReportColumns } from "./columns";
import { useGlobalMessage } from "@/components/message-provider";
import { getReportByReported } from "@/lib/api/report-api";
import useAuthStore from "@/store/use-auth-store";

const { Title } = Typography;
const { Option } = Select;

const ReceivedReportsPage: React.FC = () => {
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [reportType, setReportType] = useState<string>("Game");

  const { profile } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const messageApi = useGlobalMessage();

  const fetchReceivedReports = useCallback(async () => {
    setLoading(true);
    try {
      if (!profile) return;
      const response = await getReportByReported(profile.id, reportType);
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
  }, [profile, messageApi, reportType]);

  useEffect(() => {
    fetchReceivedReports();
  }, [fetchReceivedReports]);
  const handleReportTypeChange = (value: string ) => {
    setReportType(value);
  };
  return (
    <>
      <div className="flex justify-center py-5">
        <Title level={2}>Manage Received Reports</Title>
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
          columns={getReceivedReportColumns(fetchReceivedReports)}
          scroll={{ x: "max-content" }}
          loading={loading}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </div>
    </>
  );
};

export default ReceivedReportsPage;
