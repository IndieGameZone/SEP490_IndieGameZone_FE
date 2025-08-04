import React, { useEffect, useState, useCallback } from "react";
import { Table, Typography, message } from "antd";
import { getAllReport } from "@/lib/api/report-api";
import { ReportItem } from "@/types/report";
import { getAllReportColumns } from "./columns";

const { Title } = Typography;

const ManageSystemReport: React.FC = () => {
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [messageApi, contextHolder] = message.useMessage();

  const fetchReports = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getAllReport();
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
  }, [messageApi]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);


  return (
    <>
      {contextHolder}
      < >
        <div className="flex justify-center mb-6">
          <Title level={2}>Manage Reports System</Title>
        </div>
        
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