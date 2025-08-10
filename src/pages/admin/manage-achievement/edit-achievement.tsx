import { updateAchievement } from "@/lib/api/achievements";
import { Achievement } from "@/types/achievements";
import { Form, Input, Modal, message } from "antd";
import { useEffect, useState } from "react";

interface EditAchievementModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  achievement: Achievement | null;
}

interface EditAchievementForm {
  name: string;
}

const EditAchievement = ({
  open,
  onClose,
  onSuccess,
  achievement,
}: EditAchievementModalProps) => {
  const [form] = Form.useForm<EditAchievementForm>();
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const handleSubmit = async (values: EditAchievementForm) => {
    if (!achievement) return;

    try {
      setLoading(true);
      const result = await updateAchievement(achievement.id, { name: values.name });

      if (result.success) {
        messageApi.success("Achievement updated successfully!");
        onClose();
        onSuccess();
      } else {
        messageApi.error(result.error || "Failed to update achievement");
      }
    } catch (error) {
      messageApi.error("Failed to update achievement");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  useEffect(() => {
    if (achievement && open) {
      form.setFieldsValue({
        name: achievement.name,
      });
    }
    if (!open) {
      form.resetFields();
    }
  }, [achievement, open, form]);

  return (
    <>
      {contextHolder}
      <Modal
        title="Edit Achievement"
        open={open}
        onCancel={handleCancel}
        onOk={() => form.submit()}
        confirmLoading={loading}
        destroyOnHidden
        forceRender
      >
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
              { required: true, message: "Please input achievement name!" },
              {
                min: 2,
                message: "Achievement name must be at least 2 characters!",
              },
            ]}
          >
            <Input placeholder="Enter achievement name" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default EditAchievement;
