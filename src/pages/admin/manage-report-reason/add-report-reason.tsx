import { createReportReason } from "@/lib/api/report-api";
import { Form, Input, message, Modal, Select, Tag } from "antd";
import { useState } from "react";

interface AddReportReasonModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface AddReportReasonForm {
  types: ("Post" | "User" | "Game")[];
  name: string;
}

const typeColorMap: Record<string, string> = {
  Post: "blue",
  User: "green",
  Game: "volcano",
};

const AddReportReason = ({ open, onClose, onSuccess }: AddReportReasonModalProps) => {
  const [form] = Form.useForm<AddReportReasonForm>();
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const handleSubmit = async (values: AddReportReasonForm) => {
    try {
      setLoading(true);

      const reasons = values.types.map(
        (type) => `[${type}] - ${values.name.trim()}`
      );

      for (const name of reasons) {
        const result = await createReportReason({ name });
        if (!result.success) {
          throw new Error(result.error || "One or more reasons failed");
        }
      }

      messageApi.success("Report Reasons added successfully!");
      form.resetFields();
      onClose();
      onSuccess();
    } catch (error) {
      messageApi.error("Failed to add Report Reasons");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  return (
    <>
      {contextHolder}
      <Modal
        title="Add New Report Reason"
        open={open}
        onCancel={handleCancel}
        onOk={() => form.submit()}
        confirmLoading={loading}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          autoComplete="off"
        >
          <Form.Item
            label="Type(s)"
            name="types"
            rules={[{ required: true, message: "Please select at least one type!" }]}
          >
            <Select
              mode="multiple"
              placeholder="Select type(s)"
              tagRender={({ label }) => (
                <Tag color={typeColorMap[label as string]}>{label}</Tag>
              )}
            >
              <Select.Option value="Post">Post</Select.Option>
              <Select.Option value="User">User</Select.Option>
              <Select.Option value="Game">Game</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Report Reason"
            name="name"
            rules={[
              { required: true, message: "Please input Report Reason!" },
              {
                min: 2,
                message: "Report Reason must be at least 2 characters!",
              },
            ]}
          >
            <Input placeholder="Enter reason (e.g., Harassment)" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default AddReportReason;
