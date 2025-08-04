import { Modal, Input, Form, Button, message } from "antd";
import { useState } from "react";
import { FcApproval, FcCancel } from "react-icons/fc";
import { ReportItem } from "@/types/report";
import { updateStatusReport } from "@/lib/api/report-api";

const { TextArea } = Input;

interface ReplyReportActionModalProps {
  open: boolean;
  actionType: "approve" | "reject";
  record: ReportItem;
  onCancel: () => void;
  onSuccess: () => void;
}

const ReplyReportModal = ({ open, actionType, record, onCancel, onSuccess }: ReplyReportActionModalProps) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  const handleSubmit = async (values: { reviewMessage?: string }) => {
    setLoading(true);
    try {
      const status = actionType === "approve" ? "Approved" : "Rejected";
      const response = await updateStatusReport(record.id, status, values.reviewMessage || "");

      if (response.success) {
        messageApi.success(`Report ${status.toLowerCase()} successfully!`);
        form.resetFields();
        onSuccess();
      } else {
        throw new Error(response.error || "Failed to process report");
      }
    } catch (error: any) {
      console.error("Error processing report:", error);
      messageApi.error(error.message || "Failed to process the report");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {contextHolder}
      <Modal
        title={
          <div className="flex items-center gap-2">
            {actionType === "approve" ? (
              <>
                <FcApproval className="text-xl" />
                <span className="text-green-600">Approve Report</span>
              </>
            ) : (
              <>
                <FcCancel className="text-xl" />
                <span className="text-red-600">Reject Report</span>
              </>
            )}
          </div>
        }
        open={open}
        onCancel={handleCancel}
        footer={null}
        width={700}
        destroyOnClose
      >
        <div className="mt-4">
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h4 className="font-medium text-gray-800 mb-2">Report Details:</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="font-medium">ID:</span> {record.id}
              </div>
              <div>
                <span className="font-medium">Reporter:</span> {record.reportingUser?.userName || "N/A"}
              </div>
              <div>
                <span className="font-medium">Status:</span> {record.status}
              </div>
              <div>
                <span className="font-medium">Type:</span> {record.reportReason.type}
              </div>
            </div>
          </div>

          <Form form={form} layout="vertical" onFinish={handleSubmit}>
            <Form.Item
              name="reviewMessage"
              label="Response Message"
              rules={[
                {
                  required: true,
                  message: "Please provide a response message!",
                },
                {
                  min: 10,
                  message: "Message must be at least 10 characters!",
                },
              ]}
            >
              <TextArea
                rows={4}
                placeholder="Please provide your response message..."
                showCount
                maxLength={500}
                className="resize-none"
              />
            </Form.Item>

            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
              <Button size="large" onClick={handleCancel}>
                Cancel
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                size="large"
                className={actionType === "approve" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}
              >
                {loading ? "Processing..." : actionType === "approve" ? "Approve Report" : "Reject Report"}
              </Button>
            </div>
          </Form>
        </div>
      </Modal>
    </>
  );
};

export default ReplyReportModal;
