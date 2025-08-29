import React, { useEffect, useState, useCallback } from "react";
import { Card, Select, Space, Table, Typography, message } from "antd";
import { getAllReport } from "@/lib/api/report-api";
import { ReportItem } from "@/types/report";
import { getAllReportColumns } from "./columns";

const { Title } = Typography;
const { Option } = Select;

const ManageSystemReport: React.FC = () => {
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [messageApi, contextHolder] = message.useMessage();
  const [reportType, setReportType] = useState<string>("Game");
const reportTypeOptions = [
  { value: "Game", color: "#108ee9", icon: "🎮" },
  { value: "Review", color: "#87d068", icon: "⭐" },
  { value: "Comment", color: "#2db7f5", icon: "💬" },
  { value: "Post", color: "#f50", icon: "📝" },
];
  const fetchReports = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getAllReport(reportType);
      if (response.error) {
        throw new Error(response.error);
      }
      setReports(response.data);
    } catch (error) {
      console.error("Failed to fetch reports:", error);
      messageApi.error("Failed to fetch reports");
    } finally {
      setLoading(false);
    }
  }, [messageApi, reportType]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const handleReportTypeChange = (value: string) => {
    setReportType(value);
  };
  
  return (
    <>
      {contextHolder}
      <>
        <div className="flex justify-center mb-6">
          <Title level={2}>Manage Reports System</Title>
        </div>
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
          columns={getAllReportColumns(fetchReports)}
          rowKey="id"
          loading={loading}
          bordered
          scroll={{ x: "max-content" }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} items`,
          }}
        />
      </>
    </>
  );
};

export default ManageSystemReport;
