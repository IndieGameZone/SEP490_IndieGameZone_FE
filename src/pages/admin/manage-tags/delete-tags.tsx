import { deleteTag } from "@/lib/api/tag-api";
import { Tag } from "@/types/tag";
import { Modal, message } from "antd";
import { useState } from "react";

interface DeleteTagModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  tag: Tag | null;
}

const DeleteTag = ({ open, onClose, onSuccess, tag }: DeleteTagModalProps) => {
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const handleDelete = async () => {
    if (!tag) return;

    try {
      setLoading(true);
      const result = await deleteTag(tag.id);

      if (result.success) {
        messageApi.success("Tag deleted successfully!");
        onClose();
        onSuccess();
      } else {
        messageApi.error(result.error || "Failed to delete tag");
      }
    } catch (error) {
      messageApi.error("Failed to delete tag");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <Modal
      title="Delete Tag"
      open={open}
      onCancel={handleCancel}
      onOk={handleDelete}
      confirmLoading={loading}
      okText="Delete"
      cancelText="Cancel"
      okButtonProps={{ danger: true }}
    >
      {contextHolder}
      <p>Are you sure you want to delete the tag "{tag?.name}"?</p>
      <p style={{ color: "#ff4d4f", fontSize: "14px" }}>
        This action cannot be undone.
      </p>
    </Modal>
  );
};

export default DeleteTag;
