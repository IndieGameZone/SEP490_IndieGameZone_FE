import React, { useEffect, useState, useCallback } from "react";
import { Card, Select, Space, Table, Typography, message } from "antd";
import { getAllReport } from "@/lib/api/report-api";
import { ReportItem } from "@/types/report";
import { GamePost } from "@/types/game-post";

const { Title } = Typography;

const ManagePost: React.FC = () => {
//   const [posts, setPosts] = useState<GamePost[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [messageApi, contextHolder] = message.useMessage();

//   const fetchPosts = useCallback(async () => {
//     setLoading(true);
//     try {
//       const response = await getAllReport();
//       if (response.error) {
//         throw new Error(response.error);
//       }
//       setPosts(response.data);
//     } catch (error) {
//       console.error("Failed to fetch posts:", error);
//       messageApi.error("Failed to fetch posts");
//     } finally {
//       setLoading(false);
//     }
//   }, [messageApi, reportType]);

//   useEffect(() => {
//     fetchReports();
//   }, [fetchReports]);

 
  return (
    <>
      {/* <>
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
      </> */}
    </>
  );
};

export default ManagePost;
