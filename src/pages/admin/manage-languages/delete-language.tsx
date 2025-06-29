import { axiosClient } from "@/lib/api/config/axios-client";
import { Modal, message } from "antd";
import { useState } from "react";

import { Language } from "@/types/language";

interface DeleteLanguageModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  language: Language | null;
}

const DeleteLanguageModal = ({
  open,
  onClose,
  onSuccess,
  language,
}: DeleteLanguageModalProps) => {
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const handleDelete = async () => {
    if (!language) return;

    try {
      setLoading(true);
      await axiosClient.delete(`/languages/${language.id}`);

      messageApi.success("Language deleted successfully!");
      onClose();
      onSuccess();
    } catch (error) {
      messageApi.error("Failed to delete language");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <Modal
      title="Delete Language"
      open={open}
      onCancel={handleCancel}
      onOk={handleDelete}
      confirmLoading={loading}
      okText="Delete"
      cancelText="Cancel"
      okButtonProps={{ danger: true }}
    >
      {contextHolder}
      <p>Are you sure you want to delete the language "{language?.name}"?</p>
      <p style={{ color: "#ff4d4f", fontSize: "14px" }}>
        This action cannot be undone.
      </p>
    </Modal>
  );
};

export default DeleteLanguageModal;
