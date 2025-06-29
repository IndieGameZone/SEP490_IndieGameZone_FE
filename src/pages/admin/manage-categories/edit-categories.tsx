import { updateCategory } from "@/lib/api/category-api";
import { Category } from "@/types/category";
import { Form, Input, Modal, message } from "antd";
import { useEffect, useState } from "react";

interface EditCategoryModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  category: Category | null;
}

interface EditCategoryForm {
  name: string;
}

const EditCategory = ({
  open,
  onClose,
  onSuccess,
  category,
}: EditCategoryModalProps) => {
  const [form] = Form.useForm<EditCategoryForm>();
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const handleSubmit = async (values: EditCategoryForm) => {
    if (!category) return;

    try {
      setLoading(true);
      const result = await updateCategory(category.id, { name: values.name });

      if (result.success) {
        messageApi.success("Category updated successfully!");
        onClose();
        onSuccess();
      } else {
        messageApi.error(result.error || "Failed to update category");
      }
    } catch (error) {
      messageApi.error("Failed to update category");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  useEffect(() => {
    if (category && open) {
      form.setFieldsValue({
        name: category.name,
      });
    }
    if (!open) {
      form.resetFields();
    }
  }, [category, open, form]);

  return (
    <>
      {contextHolder}
      <Modal
        title="Edit Category"
        open={open}
        onCancel={handleCancel}
        onOk={() => form.submit()}
        confirmLoading={loading}
        destroyOnHidden
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          autoComplete="off"
        >
          <Form.Item
            label="Category Name"
            name="name"
            rules={[
              { required: true, message: "Please input category name!" },
              {
                min: 2,
                message: "Category name must be at least 2 characters!",
              },
            ]}
          >
            <Input placeholder="Enter category name" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default EditCategory;
