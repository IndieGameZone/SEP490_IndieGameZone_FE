import { updateTag } from "@/lib/api/tag-api";
import { Tag } from "@/types/tag";
import { Form, Input, Modal, message } from "antd";
import { useEffect, useState } from "react";

interface EditTagModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  tag: Tag | null;
}

interface EditTagForm {
  name: string;
}

const EditTag = ({ open, onClose, onSuccess, tag }: EditTagModalProps) => {
  const [form] = Form.useForm<EditTagForm>();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: EditTagForm) => {
    if (!tag) return;

    try {
      setLoading(true);
      const result = await updateTag(tag.id, { name: values.name });
      
      if (result.success) {
        message.success("Tag updated successfully!");
        onClose();
        onSuccess();
      } else {
        message.error(result.error || "Failed to update tag");
      }
    } catch (error) {
      message.error("Failed to update tag");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  useEffect(() => {
    if (tag && open) {
      form.setFieldsValue({
        name: tag.name,
      });
    }
    if (!open) {
      form.resetFields();
    }
  }, [tag, open, form]);

  return (
    <Modal
      title="Edit Tag"
      open={open}
      onCancel={handleCancel}
      onOk={() => form.submit()}
      confirmLoading={loading}
      destroyOnHidden
      forceRender
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit} autoComplete="off">
        <Form.Item
          label="Tag Name"
          name="name"
          rules={[
            { required: true, message: "Please input tag name!" },
            { min: 2, message: "Tag name must be at least 2 characters!" },
          ]}
        >
          <Input placeholder="Enter tag name" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditTag;