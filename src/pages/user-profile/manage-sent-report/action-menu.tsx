import { Button, Dropdown } from "antd";
import { useState } from "react";
import { FcApproval, FcCancel } from "react-icons/fc";
import { FaEye, FaEllipsisV } from "react-icons/fa";
import { ReportItem } from "@/types/report";
import ReplyReportModal from "@/pages/admin/manage-report/reply-report-modal";
import ViewDetailReportModal from "./view-detail-report-modal";


interface ActionMenuProps {
  record: ReportItem;
  onSuccess?: () => void;
}

const ActionMenu = ({ record, onSuccess }: ActionMenuProps) => {
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [actionType, setActionType] = useState<"approve" | "reject">("approve");

  const handleMenuClick = (key: string) => {
    if (key === "view") {
      setIsViewModalOpen(true);
    } else {
      setActionType(key as "approve" | "reject");
      setIsReplyModalOpen(true);
    }
  };

  const handleReplyModalCancel = () => {
    setIsReplyModalOpen(false);
  };

  const handleViewModalCancel = () => {
    setIsViewModalOpen(false);
  };

  const handleModalSuccess = () => {
    setIsReplyModalOpen(false);
    onSuccess?.();
  };

  return (
    <>
      <Dropdown
        menu={{
          items: [
            {
              key: "view",
              label: <span className="text-blue-400">View Details</span>,
              icon: <FaEye />,
              onClick: () => handleMenuClick("view"),
            },
            ...(record.status === "Pending"
              ? [
                  {
                    key: "approve",
                    label: <span className="text-green-400">Approval</span>,
                    icon: <FcApproval />,
                    onClick: () => handleMenuClick("approve"),
                  },
                  {
                    key: "reject",
                    label: <span className="text-red-400">Rejection</span>,
                    icon: <FcCancel />,
                    onClick: () => handleMenuClick("reject"),
                  },
                ]
              : []),
          ],
        }}
        trigger={["click"]}
      >
        <Button type="text" icon={<FaEllipsisV />} />
      </Dropdown>

      <ReplyReportModal
        open={isReplyModalOpen}
        actionType={actionType}
        record={record}
        onCancel={handleReplyModalCancel}
        onSuccess={handleModalSuccess}
      />

      <ViewDetailReportModal open={isViewModalOpen} record={record} onCancel={handleViewModalCancel} />
    </>
  );
};

export default ActionMenu;
