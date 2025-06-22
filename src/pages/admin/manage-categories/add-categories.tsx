import { createCategory } from "@/lib/api/category-api";
import { Form, Input, message, Modal } from "antd";
import { useState } from "react";

interface AddCategoryModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface AddCategoryForm {
  name: string;
}

const AddCategories = ({ open, onClose, onSuccess }: AddCategoryModalProps) => {
  const [form] = Form.useForm<AddCategoryForm>();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: AddCategoryForm) => {
    try {
      setLoading(true);
      const result = await createCategory({ name: values.name });
      
      if (result.success) {
        message.success("Category added successfully!");
        form.resetFields();
        onClose();
        onSuccess();
      } else {
        message.error(result.error || "Failed to add Category");
      }
    } catch (error) {
      message.error("Failed to add Category");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      title="Add New Category"
      open={open}
      onCancel={handleCancel}
      onOk={() => form.submit()}
      confirmLoading={loading}
      destroyOnHidden
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit} autoComplete="off">
        <Form.Item
          label="Category Name"
          name="name"
          rules={[
            { required: true, message: "Please input category name!" },
            { min: 2, message: "Category name must be at least 2 characters!" },
          ]}
        >
          <Input placeholder="Enter  Category" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddCategories