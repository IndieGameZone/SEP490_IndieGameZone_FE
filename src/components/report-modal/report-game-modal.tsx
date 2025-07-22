import { createReportGame } from "@/lib/api/report-api";
import useReportReasonStore from "@/store/use-report-reason-store";
import { Form, Input, Modal, Select, message } from "antd";
import { useEffect } from "react";
import useAuthStore from "@/store/use-auth-store";

interface ReportGameModalProps {
  open: boolean;
  onClose: () => void;
  gameId: string;
}

interface ReportGameForm {
  reportReasonId: string;
  message: string;
}

const ReportGameModal = ({ open, onClose, gameId }: ReportGameModalProps) => {
  const [form] = Form.useForm<ReportGameForm>();
  const { profile } = useAuthStore();
  const { gameReportReasons, fetchGameReportReasons, loading } = useReportReasonStore();
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    if (open) {
      fetchGameReportReasons();
    }
  }, [open]);

  const handleSubmit = async (values: ReportGameForm) => {
    if (!profile) {
      messageApi.error("Please login to report");
      return;
    }

    try {
      const result = await createReportGame(profile.id, {
        ...values,
        gameId,
      });

      if (result.success) {
        messageApi.success("Game reported successfully");
        form.resetFields();
        onClose();
      } else {
        messageApi.error(result.error || "Failed to report game");
      }
    } catch (error) {
      messageApi.error("Failed to report game");
    }
  };

  return (
    <>
      {contextHolder}
      <Modal title="Report Game" open={open} onCancel={onClose} onOk={() => form.submit()} confirmLoading={loading}>
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="reportReasonId"
            label="Reason"
            rules={[{ required: true, message: "Please select a reason" }]}
          >
            <Select
              loading={loading}
              placeholder="Select a reason"
              options={gameReportReasons.map((reason) => ({
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

export default ReportGameModal;
