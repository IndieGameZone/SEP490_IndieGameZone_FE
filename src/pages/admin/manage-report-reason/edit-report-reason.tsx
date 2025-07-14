import { updateReportReason } from "@/lib/api/report-api";
import { ReportReason } from "@/types/report-reason";
import { Form, Input, Modal, message } from "antd";
import { useEffect, useState } from "react";

interface EditReportReasonModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  reportReason: ReportReason | null;
}

interface EditReportReasonForm {
  name: string;
}

const EditReportReason = ({ open, onClose, onSuccess, reportReason }: EditReportReasonModalProps) => {
  const [form] = Form.useForm<EditReportReasonForm>();
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const handleSubmit = async (values: EditReportReasonForm) => {
    if (!reportReason) return;

    try {
      setLoading(true);
      const result = await updateReportReason(reportReason.id, { name: values.name });

      if (result.success) {
        messageApi.success("Report Reason  updated successfully!");
        onClose();
        onSuccess();
      } else {
        messageApi.error(result.error || "Failed to update Report Reason ");
      }
    } catch (error) {
      messageApi.error("Failed to update Report Reason ");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  useEffect(() => {
    if (reportReason && open) {
      form.setFieldsValue({
        name: reportReason.name,
      });
    }
    if (!open) {
      form.resetFields();
    }
  }, [reportReason, open, form]);

  return (
    <>
      {contextHolder}
      <Modal
        title="Edit Report Reason "
        open={open}
        onCancel={handleCancel}
        onOk={() => form.submit()}
        confirmLoading={loading}
        destroyOnHidden
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit} autoComplete="off">
          <Form.Item
            label="Report Reason "
            name="name"
            rules={[
              { required: true, message: "Please input Report Reason !" },
              {
                min: 2,
                message: "Report Reason  name must be at least 2 characters!",
              },
            ]}
          >
            <Input placeholder="Enter Report Reason " />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default EditReportReason;
