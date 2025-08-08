import { createReportPost } from "@/lib/api/report-api";
import useReportReasonStore from "@/store/use-report-reason-store";
import useAuthStore from "@/store/use-auth-store";
import { Form, Input, Modal, Select, message } from "antd";
import { useEffect } from "react";
import useGameStore from "@/store/use-game-store";

interface ReportPostModalProps {
  open: boolean;
  onClose: () => void;
  postId: string;
}

interface ReportPostForm {
  reportReasonId: string;
  message: string;
}

const ReportPostModal = ({ open, onClose, postId }: ReportPostModalProps) => {
  const [form] = Form.useForm<ReportPostForm>();
  const { profile } = useAuthStore();
  const { postReportReasons, fetchPostReportReasons, loading } = useReportReasonStore();
  const [messageApi, contextHolder] = message.useMessage();
  const { game } = useGameStore();

  useEffect(() => {
    if (open) {
      fetchPostReportReasons();
    }
  }, [open]);

  const handleSubmit = async (values: ReportPostForm) => {
    if (!profile) {
      messageApi.error("Please login to report");
      return;
    }

    try {
      const result = await createReportPost(profile.id, {
        ...values,
        postId,
        gameId: game?.id || "",

      });

      if (result.success) {
        messageApi.success("Post reported successfully");
        form.resetFields();
        onClose();
      } else {
        messageApi.error(result.error || "Failed to report post");
      }
    } catch (error) {
      messageApi.error("Failed to report post");
    }
  };

  return (
    <>
      {contextHolder}
      <Modal title="Report Post" open={open} onCancel={onClose} onOk={() => form.submit()} confirmLoading={loading}>
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="reportReasonId"
            label="Reason"
            rules={[{ required: true, message: "Please select a reason" }]}
          >
            <Select
              loading={loading}
              placeholder="Select a reason"
              options={postReportReasons.map((reason) => ({
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

export default ReportPostModal;
