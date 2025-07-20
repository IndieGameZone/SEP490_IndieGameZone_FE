import { createTag } from "@/lib/api/tag-api";
import { Form, Input, message, Modal, Select } from "antd";
import { useState } from "react";

interface AddTagModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface AddTagForm {
  name: string;
  type: string;
}

const AddTags = ({ open, onClose, onSuccess }: AddTagModalProps) => {
  const [form] = Form.useForm<AddTagForm>();
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const handleSubmit = async (values: AddTagForm) => {
    try {
      setLoading(true);
      const result = await createTag({ name: values.name, type: values.type || "Game" });

      if (result.success) {
        messageApi.success("Tag added successfully!");
        form.resetFields();
        onClose();
        onSuccess();
      } else {
        messageApi.error(result.error || "Failed to add tag");
      }
    } catch (error) {
      messageApi.error("Failed to add tag");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  return (
    <div>
      {contextHolder}
      <Modal
        title="Add New Tags"
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
              { min: 2, message: "tag name must be at least 2 characters!" },
            ]}
          >
            <Input placeholder="Enter tag name" />
          </Form.Item>
          <Form.Item
            required
            rules={[{ required: true, message: "Please select tag type!" }]}
            label="Tag Type"
            name="type"
            initialValue="Game"
          >
            <Select
              placeholder="Select tag type"
              options={[
                { value: "Game", label: "Game Tag" },
                { value: "Post", label: "Post Tag" },
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AddTags;
