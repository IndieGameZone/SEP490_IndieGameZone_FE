// columns.tsx
import { ColumnsType } from 'antd/es/table';

export interface ReportItem {
  id: string;
  title: string;
  type: string;
  createdAt: string;
  status: string;
}

export const reportColumns: ColumnsType<ReportItem> = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: 'Tiêu đề',
    dataIndex: 'title',
    key: 'title',
  },
  {
    title: 'Loại báo cáo',
    dataIndex: 'type',
    key: 'type',
  },
  {
    title: 'Ngày tạo',
    dataIndex: 'createdAt',
    key: 'createdAt',
  },
  {
    title: 'Trạng thái',
    dataIndex: 'status',
    key: 'status',
    render: (status: string) => {
      switch (status) {
        case 'pending':
          return 'Chờ duyệt';
        case 'approved':
          return 'Đã duyệt';
        case 'rejected':
          return 'Từ chối';
        default:
          return status;
      }
    },
  },
];
