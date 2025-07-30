// manage-report-page.tsx
import React, { useEffect, useState } from 'react';
import { Table, Typography, Spin } from 'antd';
import type { ReportItem } from './columns';
import { reportColumns } from './columns';

const { Title } = Typography;

const ManageReportPage: React.FC = () => {
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setTimeout(() => {
      setReports([
        {
          id: '1',
          title: 'Báo cáo vi phạm',
          type: 'Người dùng',
          createdAt: '2025-07-25',
          status: 'pending',
        },
        {
          id: '2',
          title: 'Báo cáo nội dung sai phạm',
          type: 'Game',
          createdAt: '2025-07-20',
          status: 'approved',
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>Quản lý Báo cáo</Title>
      {loading ? (
        <Spin />
      ) : (
        <Table
          dataSource={reports}
          columns={reportColumns}
          rowKey="id"
          pagination={{ pageSize: 5 }}
        />
      )}
    </div>
  );
};

export default ManageReportPage;
