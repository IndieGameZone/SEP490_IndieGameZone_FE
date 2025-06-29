import { updatePlatform } from "@/lib/api/platform-api";
import { Platform } from "@/types/platform";
import { Form, Input, Modal, message } from "antd";
import { useEffect, useState } from "react";

interface EditPlatformModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  platform: Platform | null;
}

interface EditPlatformForm {
  name: string;
}

const EditPlatform = ({
  open,
  onClose,
  onSuccess,
  platform,
}: EditPlatformModalProps) => {
  const [form] = Form.useForm<EditPlatformForm>();
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const handleSubmit = async (values: EditPlatformForm) => {
    if (!platform) return;

    try {
      setLoading(true);
      const result = await updatePlatform(platform.id, { name: values.name });

      if (result.success) {
        messageApi.success("Platform updated successfully!");
        onClose();
        onSuccess();
      } else {
        messageApi.error(result.error || "Failed to update platform");
      }
    } catch (error) {
      messageApi.error("Failed to update platform");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  useEffect(() => {
    if (platform && open) {
      form.setFieldsValue({
        name: platform.name,
      });
    }
    if (!open) {
      form.resetFields();
    }
  }, [platform, open, form]);

  return (
    <Modal
      title="Edit Platform"
      open={open}
      onCancel={handleCancel}
      onOk={() => form.submit()}
      confirmLoading={loading}
      destroyOnHidden
      forceRender
    >
      {contextHolder}
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        autoComplete="off"
      >
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
  );
};

export default EditPlatform;
