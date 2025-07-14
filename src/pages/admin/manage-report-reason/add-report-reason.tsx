import { createReportReason } from "@/lib/api/report-api";
import { Form, Input, message, Modal } from "antd";
import { useState } from "react";

interface AddReportReasonModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface AddReportReasonForm {
  name: string;
}

const AddReportReason = ({ open, onClose, onSuccess }: AddReportReasonModalProps) => {
  const [form] = Form.useForm<AddReportReasonForm>();
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const handleSubmit = async (values: AddReportReasonForm) => {
    try {
      setLoading(true);
      const result = await createReportReason({ name: values.name });

      if (result.success) {
        messageApi.success("Report Reason added successfully!");
        form.resetFields();
        onClose();
        onSuccess();
      } else {
        messageApi.error(result.error || "Failed to add Report Reason ");
      }
    } catch (error) {
      messageApi.error("Failed to add Report Reason ");
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
        title="Add New Report Reason "
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
            label="Report Reason  "
            name="name"
            rules={[
              { required: true, message: "Please input Report Reason  !" },
              {
                min: 2,
                message: "Report Reason   must be at least 2 characters!",
              },
            ]}
          >
            <Input placeholder="Enter  Report Reason " />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default AddReportReason;
