import { deletePlatform } from "@/lib/api/platform-api";
import { Platform } from "@/types/platform";
import { Modal, message } from "antd";
import { useState } from "react";

interface DeletePlatformModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  platform: Platform | null;
}

const DeletePlatform = ({ open, onClose, onSuccess, platform }: DeletePlatformModalProps) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!platform) return;
    
    try {
      setLoading(true);
      const result = await deletePlatform(platform.id);
      
      if (result.success) {
        message.success("Platform deleted successfully!");
        onClose();
        onSuccess();
      } else {
        message.error(result.error || "Failed to delete platform");
      }
    } catch (error) {
      message.error("Failed to delete platform");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <Modal
      title="Delete Platform"
      open={open}
      onCancel={handleCancel}
      onOk={handleDelete}
      confirmLoading={loading}
      okText="Delete"
      cancelText="Cancel"
      okButtonProps={{ danger: true }}
    >
      <p>
        Are you sure you want to delete the platform "{platform?.name}"?
      </p>
      <p style={{ color: '#ff4d4f', fontSize: '14px' }}>
        This action cannot be undone.
      </p>
    </Modal>
  );
};

export default DeletePlatform;