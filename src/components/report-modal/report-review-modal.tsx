import { createReportPost, createReportReview } from "@/lib/api/report-api";
import useReportReasonStore from "@/store/use-report-reason-store";
import useAuthStore from "@/store/use-auth-store";
import { Form, Input, Modal, Select, message } from "antd";
import { useEffect } from "react";
import useGameStore from "@/store/use-game-store";
import { createReview } from "@/lib/api/review-api";

interface ReportReviewModalProps {
  open: boolean;
  onClose: () => void;
  reviewId: string;
}

interface ReportReviewForm {
  reportReasonId: string;
  message: string;
}

const ReportReviewModal = ({ open, onClose, reviewId }: ReportReviewModalProps) => {
  const [form] = Form.useForm<ReportReviewForm>();
  const { profile } = useAuthStore();
  const { reviewReportReasons, fetchReviewReportReasons, loading } = useReportReasonStore();
  const [messageApi, contextHolder] = message.useMessage();
  const { game } = useGameStore();

  useEffect(() => {
    if (open) {
      fetchReviewReportReasons();
    }
  }, [open]);

  const handleSubmit = async (values: ReportReviewForm) => {
    if (!profile) {
      messageApi.error("Please login to report");
      return;
    }

    try {
      const result = await createReportReview(profile.id, {
        ...values,
        reviewId,
        gameId: game?.id || "",

      });

      if (result.success) {
        messageApi.success("Review reported successfully");
        form.resetFields();
        onClose();
      } else {
        messageApi.error(result.error || "Failed to report review");
      }
    } catch (error) {
      messageApi.error("Failed to report review");
    }
  };

  return (
    <>
      {contextHolder}
      <Modal title="Report Review" open={open} onCancel={onClose} onOk={() => form.submit()} confirmLoading={loading}>
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="reportReasonId"
            label="Reason"
            rules={[{ required: true, message: "Please select a reason" }]}
          >
            <Select
              loading={loading}
              placeholder="Select a reason"
              options={reviewReportReasons.map((reason) => ({
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

export default ReportReviewModal;
