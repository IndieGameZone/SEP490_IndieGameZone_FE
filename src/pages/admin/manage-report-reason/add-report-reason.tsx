import { createReportReason } from "@/lib/api/report-api";
import { Form, Input, message, Modal, Select } from "antd";
import { useState } from "react";
interface AddReportReasonModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface AddReportReasonForm {
  name: string;
  type: string;
}

const AddReportReason = ({ open, onClose, onSuccess }: AddReportReasonModalProps) => {
  const [form] = Form.useForm<AddReportReasonForm>();
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const handleSubmit = async (values: AddReportReasonForm) => {
    try {
      setLoading(true);
      const result = await createReportReason({
        name: values.name.trim(),
        type: values.type,
      });

      if (!result.success) {
        throw new Error(result.error || "Failed to add report reason");
      }

      messageApi.success("Report Reason added successfully!");
      form.resetFields();
      onClose();
      onSuccess();
    } catch (error) {
      messageApi.error("Failed to add Report Reason");
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
        title={`Add New  Report Reason`}
        open={open}
        onCancel={handleCancel}
        onOk={() => form.submit()}
        confirmLoading={loading}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit} autoComplete="off">
          <Form.Item
            label="Report Reason"
            name="name"
            rules={[
              { required: true, message: "Please input Report Reason!" },
              { min: 2, message: "Report Reason must be at least 2 characters!" },
            ]}
          >
            <Input placeholder="Enter reason (e.g., Harassment)" />
          </Form.Item>
          <Form.Item
            label="Type"
            name="type"
            initialValue="Game"
            rules={[{ required: true, message: "Please select type!" }]}
          >
            <Select
              placeholder="Select report type"
              options={[
                { value: "Game", label: "Game Report" },
                { value: "Post", label: "Post Report" },
                { value: "User", label: "User Report" },
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default AddReportReason;
