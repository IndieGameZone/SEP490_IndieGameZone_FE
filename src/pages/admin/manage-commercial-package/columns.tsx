// columns.tsx
import { useGlobalMessage } from "@/components/message-provider";
import { activeCommercialPackageRegistration } from "@/lib/api/commercial-package-api";
import { formatCurrencyVND } from "@/lib/currency";
import { CommercialPackage } from "@/types/commercial-package";
import { Badge, Button, Space } from "antd";
import { ColumnsType } from "antd/es/table";
import { useState } from "react";

export const reportColumns = (fetchData: () => void): ColumnsType<CommercialPackage> => {
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});
  const messageApi = useGlobalMessage();
  return [
    {
      title: "Developer Name",
      dataIndex: "developer",
      key: "developer.userName",
      render: (developer: { userName: string }) => developer.userName || "N/A",
    },
    {
      title: "Game Name",
      dataIndex: "gameName",
      key: "gameName",
      render: (name: string) => name || "N/A",
    },
    {
      title: "Commercial Package Name",
      dataIndex: "commercialPackageName",
      key: "commercialPackageName",
      render: (name: string) => name || "N/A",
    },
    {
      title: "Duration (days)",
      dataIndex: "duration",
      key: "duration",
    },
    {
      title: "Price ",
      dataIndex: "price",
      key: "price",
      render: (price: number) => formatCurrencyVND(price),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        let badgeStatus: "default" | "success" | "processing" | "error" | "warning" = "default";
        switch (status.toLowerCase()) {
          case "pending":
            badgeStatus = "processing";
            break;
          case "active":
            badgeStatus = "success";
            break;
          case "expired":
            badgeStatus = "warning";
            break;
          case "cancelled":
            badgeStatus = "default";
            break;
          case "failed":
            badgeStatus = "error";
            break;
        }
        return <Badge status={badgeStatus} text={status} />;
      },
      width: 100,
    },
    {
      title: "Start Date",
      dataIndex: "startDate",
      key: "startDate",
      render: (value) => {
        return new Date(value).toDateString();
      },
    },
    {
      title: "End Date",
      dataIndex: "endDate",
      key: "endDate",
      render: (value) => {
        return new Date(value).toDateString();
      },
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (_, record: CommercialPackage) => {
        if (record.status?.toLowerCase() === "pending") {
          return (
            <Space size="middle">
              <Button
                type="primary"
                loading={loadingStates[record.id]}
                onClick={async () => {
                  try {
                    setLoadingStates((prev) => ({ ...prev, [record.id]: true }));
                    const response = await activeCommercialPackageRegistration(record.id);
                    if (response.success) {
                      messageApi.success("Commercial package activated successfully");
                      fetchData();
                    } else {
                      messageApi.error(response.error || "Failed to activate commercial package");
                    }
                  } catch (error) {
                    messageApi.error("An error occurred while activating the commercial package");
                    console.error(error);
                  } finally {
                    setLoadingStates((prev) => ({ ...prev, [record.id]: false }));
                  }
                }}
              >
                Active
              </Button>
            </Space>
          );
        }
        return null;
      },
    },
  ];
};
