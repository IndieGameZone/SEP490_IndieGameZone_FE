import { deleteCommercialPackages } from "@/lib/api/commercial-package-api";
import { CommercialPackage } from "@/types/commercial-package";
import { Modal, message } from "antd";
import { useState } from "react";

interface DeleteCommercialPackageProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  commercialPackage: CommercialPackage | null;
}

const DeleteCommercialPackage = ({ open, onClose, onSuccess, commercialPackage }: DeleteCommercialPackageProps) => {
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const handleDelete = async () => {
    if (!commercialPackage) return;

    try {
      setLoading(true);
      const result = await deleteCommercialPackages(commercialPackage.id);

      if (result.success) {
        messageApi.success("Commercial package deleted successfully!");
        onClose();
        onSuccess();
      } else {
        messageApi.error(result.error || "Failed to delete commercial package");
      }
    } catch (error) {
      messageApi.error("Failed to delete commercial package");
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
        title="Delete Commercial Package"
        open={open}
        onCancel={handleCancel}
        onOk={handleDelete}
        confirmLoading={loading}
        okText="Delete"
        cancelText="Cancel"
        okButtonProps={{ danger: true }}
      >
        <p>Are you sure you want to delete the commercial package "{commercialPackage?.name}"?</p>
        <p style={{ color: "#ff4d4f", fontSize: "14px" }}>This action cannot be undone.</p>
      </Modal>
    </>
  );
};

export default DeleteCommercialPackage;