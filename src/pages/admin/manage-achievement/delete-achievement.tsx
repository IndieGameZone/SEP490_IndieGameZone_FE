import { deleteAchievement } from "@/lib/api/achievements-api";
import { Achievement } from "@/types/achievements";
import { Modal, message } from "antd";
import { useState } from "react";

interface DeleteAchievementModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  achievement: Achievement | null;
}

const DeleteAchievement = ({
  open,
  onClose,
  onSuccess,
  achievement,
}: DeleteAchievementModalProps) => {
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const handleDelete = async () => {
    if (!achievement) return;

    try {
      setLoading(true);
      const result = await deleteAchievement(achievement.id);

      if (result.success) {
        messageApi.success("Achievement deleted successfully!");
        onClose();
        onSuccess();
      } else {
        messageApi.error(result.error || "Failed to delete achievement");
      }
    } catch (error) {
      messageApi.error("Failed to delete achievement");
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
        title="Delete Achievement"
        open={open}
        onCancel={handleCancel}
        onOk={handleDelete}
        confirmLoading={loading}
        okText="Delete"
        cancelText="Cancel"
        okButtonProps={{ danger: true }}
      >
        <p>Are you sure you want to delete the achievement "{achievement?.name}"?</p>
        <p style={{ color: "#ff4d4f", fontSize: "14px" }}>
          This action cannot be undone.
        </p>
      </Modal>
    </>
  );
};

export default DeleteAchievement;
