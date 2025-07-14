import { deleteReportReason } from "@/lib/api/report-api";
import { ReportReason } from "@/types/report-reason";
import { Modal, message } from "antd";
import { useState } from "react";

interface DeleteReportReasonModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  reportReason: ReportReason | null;
}

const DeleteReportReason = ({ open, onClose, onSuccess, reportReason }: DeleteReportReasonModalProps) => {
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const handleDelete = async () => {
    if (!reportReason) return;

    try {
      setLoading(true);
      const result = await deleteReportReason(reportReason.id);

      if (result.success) {
        messageApi.success("Report Reason  deleted successfully!");
        onClose();
        onSuccess();
      } else {
        messageApi.error(result.error || "Failed to delete Report Reason ");
      }
    } catch (error) {
      messageApi.error("Failed to delete Report Reason ");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <>
      {contextHolder}
      <Modal
        title="Delete Report Reason "
        open={open}
        onCancel={handleCancel}
        onOk={handleDelete}
        confirmLoading={loading}
        okText="Delete"
        cancelText="Cancel"
        okButtonProps={{ danger: true }}
      >
        <p>Are you sure you want to delete the Report Reason  "{reportReason?.name}"?</p>
        <p style={{ color: "#ff4d4f", fontSize: "14px" }}>This action cannot be undone.</p>
      </Modal>
    </>
  );
};

export default DeleteReportReason;
