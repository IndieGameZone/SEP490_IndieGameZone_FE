import { Modal, message } from "antd";
import { useState } from "react";
import { AgeRestriction } from "@/types/age-restriction";
import { deleteAgeRestriction } from "@/lib/api/age-restriction-api";

interface DeleteAgeRestrictionModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  record: AgeRestriction | null;
}

const DeleteAgeRestrictionModal = ({
  open,
  onClose,
  onSuccess,
  record,
}: DeleteAgeRestrictionModalProps) => {
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const handleDelete = async () => {
    if (!record) return;

    setLoading(true);
    const result = await deleteAgeRestriction(record.id);
    setLoading(false);
    if (result.error) {
      messageApi.error("Failed to delete age restriction");
    } else {
      messageApi.success("Age Restriction deleted successfully!");
      onClose();
      onSuccess();
    }
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <Modal
      title="Delete Age Restriction"
      open={open}
      onCancel={handleCancel}
      onOk={handleDelete}
      confirmLoading={loading}
      okText="Delete"
      cancelText="Cancel"
      okButtonProps={{ danger: true }}
    >
      {contextHolder}
      <p>
        Are you sure you want to delete the age restriction "{record?.code}"?
      </p>
      <p style={{ color: "#ff4d4f", fontSize: "14px" }}>
        This action cannot be undone.
      </p>
    </Modal>
  );
};

export default DeleteAgeRestrictionModal;
