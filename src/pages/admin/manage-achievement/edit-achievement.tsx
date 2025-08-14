import { updateAchievement } from "@/lib/api/achievements-api";
import { uploadFile } from "@/lib/api/file-api";
import { Achievement } from "@/types/achievements";
import { Button, Form, Image, Input, Modal, Upload, message } from "antd";
import { RcFile, UploadChangeParam, UploadFile, UploadProps } from "antd/es/upload";
import { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons"; 

interface EditAchievementModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  achievement: Achievement | null;
}

interface EditAchievementForm {
  name: string;
  image: string;
}

const EditAchievement = ({ open, onClose, onSuccess, achievement }: EditAchievementModalProps) => {
  const [form] = Form.useForm<EditAchievementForm>();
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [uploadLoading, setUploadLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>("");
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

  const handleUploadChange: UploadProps["onChange"] = (info: UploadChangeParam<UploadFile>) => {
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
    onClose();
  };
  const handleSubmit = async (values: EditAchievementForm) => {
    if (!achievement) return;
    if (!imageUrl) {
      messageApi.error("Please upload an achievement image!");
      return;
    }
    try {
      setLoading(true);
      const result = await updateAchievement(achievement.id, {
        name: values.name,
        image: imageUrl, 
      });

      if (result.success) {
        messageApi.success("Achievement updated successfully!");
        handleCancel(); 
        onSuccess();
      } else {
        messageApi.error(result.error || "Failed to update achievement");
      }
    } catch (error) {
      messageApi.error("Failed to update achievement");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (achievement && open) {
      form.setFieldsValue({
        name: achievement.name,
      });
      setImageUrl(achievement.image || ""); 
    }
  }, [achievement, open, form]);
  return (
    <>
      {contextHolder}
      <Modal
        title="Edit Achievement"
        open={open}
        onCancel={handleCancel}
        onOk={() => form.submit()}
        confirmLoading={loading}
        destroyOnHidden
        forceRender
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit} autoComplete="off">
          <Form.Item
            label="Platform Name"
            name="name"
            rules={[
              { required: true, message: "Please input achievement name!" },
              {
                min: 2,
                message: "Achievement name must be at least 2 characters!",
              },
            ]}
          >
            <Input placeholder="Enter achievement name" />
          </Form.Item>

          <Form.Item
            label="Achievement Image"
            required={true}
            extra="Upload Achievement Image  (JPG, PNG - Max: 5MB)"
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
                      {uploadLoading ? "Uploading..." : "Click or drag file to upload"}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">JPG, PNG (Max: 5MB)</div>
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
                      mask: <div className="text-white text-sm">Click to preview</div>,
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
                <div className="mt-2 text-xs text-gray-500">Click the image to preview in full size</div>
              </div>
            )}
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default EditAchievement;
