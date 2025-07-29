import { changeStatusReport } from "@/lib/api/report-api";
import { formatDateTime } from "@/lib/date-n-time";
import { ReportItem } from "@/types/report";
import { ReportReason } from "@/types/report-reason";
import { User } from "@/types/user";
import { Select } from "antd";
import { ColumnsType } from "antd/es/table";

export const createReportColumns = (messageApi: any, onStatusChange?: () => void): ColumnsType<ReportItem> => [
  // {
  //   title: "ID",
  //   dataIndex: "id",
  //   key: "id",
  //   width: 80,
  // },
  {
    title: "Reporter",
    dataIndex: "reportingUser",
    key: "reportingUser",
    render: (reportingUser: User | undefined) => reportingUser?.userName ?? "N/A",
    width: 120,
  },
  {
    title: "Report Reason",
    dataIndex: "reportReason",
    key: "reportReason",
    render: (reportReason: ReportReason | undefined) => reportReason?.name ?? "N/A",
    width: 150,
  },
  {
    title: "Message",
    dataIndex: "message",
    key: "message",
    ellipsis: true,
  },
  {
    title: "Report Type",
    dataIndex: "reportType",
    key: "reportType",
    render: (reportType: { name: string } | undefined) => reportType?.name ?? "N/A",
    width: 120,
  },
  {
    title: "Status",
    dataIndex: "isResolved",
    key: "isResolved",
    width: 130,
    render: (isResolved: boolean, record: ReportItem) => (
      <Select
        value={isResolved}
        onChange={async (value: boolean) => {
          try {
            const result = await changeStatusReport(record.id, value ? "true" : "false");

            if (result.error) {
              messageApi.error("Failed to update report status");
              return;
            }

            messageApi.success("Report status updated successfully");

            if (onStatusChange) {
              onStatusChange();
            }
          } catch (error) {
            console.error("Error updating report status:", error);
            messageApi.error("An error occurred while updating status");
          }
        }}
        options={[
          {
            value: false,
            label: (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span className="text-red-700 font-medium">No</span>
              </div>
            ),
          },
          {
            value: true,
            label: (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-green-700 font-medium">Yes</span>
              </div>
            ),
          },
        ]}
        className="min-w-[110px]"
        size="small"
        variant="borderless"
        suffixIcon={
          <div className="text-gray-400">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
              <path
                d="M3 4.5L6 7.5L9 4.5"
                stroke="currentColor"
                strokeWidth="1.5"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        }
      />
    ),
  },
  {
    title: "Created At",
    dataIndex: "createdAt",
    key: "createdAt",
    width: 150,
    render: (date: string) => <div className="text-sm text-gray-600">{formatDateTime(new Date(date))}</div>,
  },
  {
    title: "Updated At",
    dataIndex: "updatedAt",
    key: "updatedAt",
    width: 150,
    render: (date: string) => <div className="text-sm text-gray-600">{formatDateTime(new Date(date))}</div>,
  },
];
