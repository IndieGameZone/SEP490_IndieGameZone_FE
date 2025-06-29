import { deleteCategory } from "@/lib/api/category-api";
import { Category } from "@/types/category";
import { Modal, message } from "antd";
import { useState } from "react";

interface DeleteCategoryModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  category: Category | null;
}

const DeleteCategory = ({
  open,
  onClose,
  onSuccess,
  category,
}: DeleteCategoryModalProps) => {
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const handleDelete = async () => {
    if (!category) return;

    try {
      setLoading(true);
      const result = await deleteCategory(category.id);

      if (result.success) {
        messageApi.success("Category deleted successfully!");
        onClose();
        onSuccess();
      } else {
        messageApi.error(result.error || "Failed to delete category");
      }
    } catch (error) {
      messageApi.error("Failed to delete category");
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
        title="Delete Category"
        open={open}
        onCancel={handleCancel}
        onOk={handleDelete}
        confirmLoading={loading}
        okText="Delete"
        cancelText="Cancel"
        okButtonProps={{ danger: true }}
      >
        <p>Are you sure you want to delete the category "{category?.name}"?</p>
        <p style={{ color: "#ff4d4f", fontSize: "14px" }}>
          This action cannot be undone.
        </p>
      </Modal>
    </>
  );
};

export default DeleteCategory;
