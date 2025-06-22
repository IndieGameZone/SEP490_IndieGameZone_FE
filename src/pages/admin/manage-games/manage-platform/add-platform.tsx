import { createPlatform } from "@/lib/api/platform-api";
import { Form, Input, message, Modal } from "antd";
import { useState } from "react";

interface AddPlatformModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface AddPlatformForm {
  name: string;
}

const AddPlatform = ({ open, onClose, onSuccess }: AddPlatformModalProps) => {
  const [form] = Form.useForm<AddPlatformForm>();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: AddPlatformForm) => {
    try {
      setLoading(true);
      const result = await createPlatform({ name: values.name });
      
      if (result.success) {
        message.success("Platform added successfully!");
        form.resetFields();
        onClose();
        onSuccess();
      } else {
        message.error(result.error || "Failed to add platform");
      }
    } catch (error) {
      message.error("Failed to add platform");
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
      {" "}
      <Modal
        title="Add New Platform"
        open={open}
        onCancel={handleCancel}
        onOk={() => form.submit()}
        confirmLoading={loading}
        destroyOnHidden
        forceRender
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit} autoComplete="off">
          <Form.Item
            label="Platform Name"
            name="name"
            rules={[
              { required: true, message: "Please input platform name!" },
              { min: 2, message: "Platform name must be at least 2 characters!" },
            ]}
          >
            <Input placeholder="Enter platform name" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AddPlatform;