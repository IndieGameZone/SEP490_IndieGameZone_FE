import { Modal, Input, Form, Upload, Image, Button, message } from "antd";
import { useState } from "react";
import { FaTrash } from "react-icons/fa";
import { FcApproval, FcCancel } from "react-icons/fc";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import type { UploadChangeParam } from "antd/es/upload";
import type { RcFile, UploadFile, UploadProps } from "antd/es/upload/interface";
import { Withdraw } from "@/types/withdraw-request";
import { uploadFile } from "@/lib/api/file-api";
import { updateWithdrawRequestStatus } from "@/lib/api/withdraw-api";

const { TextArea } = Input;

interface WithdrawActionModalProps {
  open: boolean;
  actionType: "approve" | "reject";
  record: Withdraw;
  onCancel: () => void;
  onSuccess: () => void;
}

const WithdrawActionModal = ({
  open,
  actionType,
  record,
  onCancel,
  onSuccess,
}: WithdrawActionModalProps) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [form] = Form.useForm();

  const beforeUpload = (file: RcFile) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      messageApi.error("You can only upload JPG/PNG file!");
      return false;
    }
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      messageApi.error("Image must be smaller than 5MB!");
      return false;
    }
    return true;
  };

  const customUpload = async ({ file, onSuccess, onError }: any) => {
    try {
      setUploadLoading(true);

      const result = await uploadFile(file as File);

      if (result.error) {
        onError(new Error(result.error));
        messageApi.error("Upload failed!");
        return;
      }

      setImageUrl(result.data);
      onSuccess(result.data);
      messageApi.success("Image uploaded successfully!");
    } catch (error) {
      onError(error);
      messageApi.error("Upload failed!");
    } finally {
      setUploadLoading(false);
    }
  };

  const handleUploadChange: UploadProps["onChange"] = (
    info: UploadChangeParam<UploadFile>
  ) => {
    if (info.file.status === "uploading") {
      setUploadLoading(true);
      return;
    }
    if (info.file.status === "done") {
      setUploadLoading(false);
    }
  };

  const handleRemoveImage = () => {
    setImageUrl("");
  };

  const handleCancel = () => {
    setImageUrl("");
    form.resetFields();
    onCancel();
  };

  const handleSubmit = async (values: any) => {
    if (!imageUrl) {
      messageApi.error("Please upload proof image!");
      return;
    }

    setLoading(true);
    try {
      const status = actionType === "approve" ? "Approved" : "Rejected";
      const rejectReason =
        actionType === "reject" ? values.rejectReason : undefined;

      const result = await updateWithdrawRequestStatus(record.id, {
        ImageProof: imageUrl,
        Status: status,
        RejectReason: rejectReason,
      });

      console.log("Update result:", result);

      if (result.error) {
        messageApi.error(result.error);
        return;
      }

      messageApi.success(
        `Withdraw request ${
          actionType === "approve" ? "approved" : "rejected"
        } successfully!`
      );
      handleCancel();
      onSuccess();
    } catch (error) {
      console.error("Update error:", error); // Debug log
      messageApi.error("An error occurred while processing the request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {contextHolder}
      <Modal
        title={
          <div className="flex items-center gap-2">
            {actionType === "approve" ? (
              <>
                <FcApproval className="text-xl" />
                <span className="text-green-600">Approve Withdraw Request</span>
              </>
            ) : (
              <>
                <FcCancel className="text-xl" />
                <span className="text-red-600">Reject Withdraw Request</span>
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
            <h4 className="font-medium text-gray-800 mb-2">Request Details:</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="font-medium">ID:</span> {record.id}
              </div>
              <div>
                <span className="font-medium">Amount:</span>{" "}
                {record.amount?.toLocaleString()} VND
              </div>
              <div>
                <span className="font-medium">Requester:</span>{" "}
                {record.requester?.userName || "N/A"}
              </div>
              <div>
                <span className="font-medium">Status:</span> {record.status}
              </div>
            </div>
          </div>

          <Form form={form} layout="vertical" onFinish={handleSubmit}>
            <Form.Item
              label="Proof Image"
              required
              extra="Upload proof of bank transfer completion (JPG, PNG - Max: 5MB)"
              style={{ width: "100%" }}
            >
              {!imageUrl ? (
                <Upload
                  name="proof"
                  showUploadList={false}
                  beforeUpload={beforeUpload}
                  onChange={handleUploadChange}
                  customRequest={customUpload}
                  className="w-full"
                  style={{ width: "100%" }}
                >
                  <div className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 transition-colors cursor-pointer">
                    <div className="flex flex-col items-center justify-center h-full">
                      {uploadLoading ? (
                        <LoadingOutlined className="text-2xl text-blue-500 mb-2" />
                      ) : (
                        <PlusOutlined className="text-2xl text-gray-400 mb-2" />
                      )}
                      <div className="text-sm text-gray-500">
                        {uploadLoading
                          ? "Uploading..."
                          : "Click or drag file to upload"}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        JPG, PNG (Max: 5MB)
                      </div>
                    </div>
                  </div>
                </Upload>
              ) : (
                <div className="w-full">
                  <div className="relative inline-block w-fit min-h-40 min-w-40">
                    <Image
                      src={imageUrl}
                      alt="Proof"
                      className="rounded-lg border border-gray-200"
                      style={{
                        maxWidth: "100%",
                        maxHeight: "300px",
                        objectFit: "contain",
                      }}
                      preview={{
                        mask: (
                          <div className="text-white text-sm">
                            Click to preview
                          </div>
                        ),
                      }}
                    />
                    <div className="absolute top-2 right-2 flex gap-1">
                      <Button
                        type="primary"
                        danger
                        size="small"
                        icon={<FaTrash />}
                        onClick={handleRemoveImage}
                        className="shadow-lg"
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-gray-500">
                    Click the image to preview in full size
                  </div>
                </div>
              )}
            </Form.Item>

            {actionType === "reject" && (
              <Form.Item
                name="rejectReason"
                label="Rejection Reason"
                rules={[
                  {
                    required: true,
                    message: "Please provide rejection reason!",
                  },
                  {
                    min: 10,
                    message: "Reason must be at least 10 characters!",
                  },
                ]}
              >
                <TextArea
                  rows={4}
                  placeholder="Please provide detailed reason for rejection..."
                  showCount
                  maxLength={500}
                  className="resize-none"
                />
              </Form.Item>
            )}

            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
              <Button size="large" onClick={handleCancel}>
                Cancel
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                size="large"
                className={
                  actionType === "approve"
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-red-600 hover:bg-red-700"
                }
              >
                {loading
                  ? "Processing..."
                  : actionType === "approve"
                  ? "Approve Request"
                  : "Reject Request"}
              </Button>
            </div>
          </Form>
        </div>
      </Modal>
    </div>
  );
};

export default WithdrawActionModal;
