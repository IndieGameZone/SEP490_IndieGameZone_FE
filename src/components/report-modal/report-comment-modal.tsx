import { createReportComment } from "@/lib/api/report-api";
import useReportReasonStore from "@/store/use-report-reason-store";
import useAuthStore from "@/store/use-auth-store";
import { Form, Input, Modal, Select, message } from "antd";
import { useEffect } from "react";

interface ReportCommentModalProps {
  open: boolean;
  onClose: () => void;
  commentId: string;
}

interface ReportCommentForm {
  reportReasonId: string;
  message: string;
}

const ReportCommentModal = ({ open, onClose, commentId }: ReportCommentModalProps) => {
  const [form] = Form.useForm<ReportCommentForm>();
  const { profile } = useAuthStore();
  const { commentReportReasons, fetchCommentReportReasons, loading } = useReportReasonStore();
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    if (open) {
      fetchCommentReportReasons();
    }
  }, [open]);

  const handleSubmit = async (values: ReportCommentForm) => {
    if (!profile) {
      messageApi.error("Please login to report");
      return;
    }

    try {
      const result = await createReportComment(profile.id, {
        ...values,
        commentId,
      });

      if (result.success) {
        messageApi.success("Comment reported successfully");
        form.resetFields();
        onClose();
      } else {
        messageApi.error(result.error || "Failed to report comment");
      }
    } catch (error) {
      messageApi.error("Failed to report comment");
    }
  };

  return (
    <>
      {contextHolder}
      <Modal title="Report Comment" open={open} onCancel={onClose} onOk={() => form.submit()} confirmLoading={loading}>
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="reportReasonId"
            label="Reason"
            rules={[{ required: true, message: "Please select a reason" }]}
          >
            <Select
              loading={loading}
              placeholder="Select a reason"
              options={commentReportReasons.map((reason) => ({
                label: reason.name,
                value: reason.id,
              }))}
            />
          </Form.Item>

          <Form.Item
            name="message"
            label="Additional Information"
            rules={[
              { required: true, message: "Please provide additional information" },
              { min: 10, message: "Message must be at least 10 characters" },
            ]}
          >
            <Input.TextArea rows={4} placeholder="Describe the issue" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default ReportCommentModal;
