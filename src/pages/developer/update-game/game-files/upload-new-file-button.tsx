import { useGlobalMessage } from "@/components/message-provider";
import { axiosClient } from "@/lib/api/config/axios-client";
import { addGameFiles } from "@/lib/api/game-api";
import { formatBytes } from "@/lib/file";
import useGameStore from "@/store/use-game-store";
import usePlatformStore from "@/store/use-platform-store";
import {
  Alert,
  Button,
  Form,
  FormProps,
  Input,
  Modal,
  Progress,
  Select,
  Upload,
  UploadFile,
} from "antd";
import { RcFile } from "antd/es/upload";
import { useMemo, useState } from "react";
import { FaRedo, FaUpload } from "react-icons/fa";

const allowedTypes = [
  ".exe",
  ".msi",
  ".sh",
  ".bat",
  ".apk",
  ".zip",
  ".rar",
  ".7z",
  ".tar",
  ".gz",
];

type FieldType = {
  displayName: string;
  platformId: string;
  file: UploadFile;
};

const UploadNewFileButton = () => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const { platforms } = usePlatformStore();
  const messageApi = useGlobalMessage();
  const [formDataCache, setFormDataCache] = useState<FieldType | null>(null);
  const { game, rerender, gameFiles } = useGameStore();
  const platformsOptions = useMemo(() => {
    return platforms.map((x) => ({ value: x.id, label: x.name }));
  }, [platforms]);

  const displayNameValidator = async (_: any, value: string) => {
    if (gameFiles.find((x) => x.displayName == value)) {
      return Promise.reject(
        new Error(
          "Each file must have a unique display name. Please include a version number like 'v1.0' or build name to differentiate!"
        )
      );
    }
    return Promise.resolve();
  };

  const handleBeforeUpload = (file: File) => {
    const isAllowed = allowedTypes.some((type) =>
      file.name.toLowerCase().endsWith(type)
    );
    if (!isAllowed) {
      messageApi.error(
        `${file.name} is not a valid executable or compressed file`
      );
      return false;
    }
    const rcFile = file as RcFile;
    rcFile.uid = String(Date.now());

    const newFile: UploadFile = {
      uid: rcFile.uid,
      name: rcFile.name,
      status: "done",
      originFileObj: rcFile,
      size: rcFile.size,
    };

    setFileList([newFile]);

    form.setFieldsValue({ displayName: file.name });
    form.validateFields(["displayName"]);
    setFileUrl(null);
    return false;
  };

  const uploadFileToAPI = async (file: File) => {
    console.log("Aye, I upload again. Not good!");
    const formData = new FormData();
    formData.append("file", file);
    const response = await axiosClient.post("/api/files", formData, {
      onUploadProgress: (progressEvent) => {
        const percent = Math.round(
          (progressEvent.loaded * 100) / (progressEvent.total || 1)
        );
        setUploadProgress(percent);
      },
    });
    return response.data;
  };

  const submitFormData = async (data: FieldType, fileUrl: string) => {
    if (!game) return;
    const result = await addGameFiles(game.id, [
      { file: fileUrl, platformId: data.platformId },
    ]);
    if (result.error) {
      throw Error("Failed to attach file!");
    }
  };

  const handleSubmitLogic = async (values: FieldType) => {
    setLoading(true);
    setErrorMessage("");

    try {
      let url = fileUrl;
      if (!url) {
        const rawFile = fileList[0]?.originFileObj;
        if (!rawFile) throw new Error("No file selected");
        url = await uploadFileToAPI(rawFile);
        setFileUrl(url); // Save for retry
      }
      if (url) {
        await submitFormData(values, url);
      } else {
        throw new Error("No file url");
      }

      form.resetFields();
      setFileList([]);
      setFileUrl(null);
      setFormDataCache(null);
      setIsModalOpen(false);
      messageApi.success("Upload file successfully!");
      setTimeout(() => {
        rerender();
      }, 1000);
    } catch (err: any) {
      setFormDataCache(values);
      messageApi.error("Something went wrong! Please try again.");
      setErrorMessage("Something went wrong! Please try again.");
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    handleSubmitLogic(values);
  };

  const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (_) => {};

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    form.submit();
  };

  const handleCancel = () => {
    form.resetFields();
    setFileList([]);
    setFileUrl(null);
    setErrorMessage("");
    setIsModalOpen(false);
    setFormDataCache(null);
  };

  const handleRetry = () => {
    if (formDataCache && fileUrl) {
      handleSubmitLogic(formDataCache);
    }
  };
  return (
    <>
      <Button type="primary" onClick={showModal} icon={<FaUpload />}>
        Upload new file
      </Button>
      <Modal
        title="Upload new file"
        open={isModalOpen}
        onOk={handleOk}
        maskClosable={false}
        onCancel={handleCancel}
        footer={() => (
          <>
            <Button onClick={handleCancel}>Cancel</Button>
            {errorMessage && fileUrl && formDataCache ? (
              <Button
                onClick={handleRetry}
                disabled={loading}
                type="primary"
                loading={loading}
                icon={<FaRedo />}
              >
                Retry Submit
              </Button>
            ) : (
              <Button
                type="primary"
                onClick={handleOk}
                icon={<FaUpload />}
                loading={loading}
              >
                Submit
              </Button>
            )}
          </>
        )}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item<FieldType>
            label="Upload File"
            name="file"
            rules={[{ required: true, message: "Please upload a file" }]}
            extra="Upload the actual game file (compressed builds are accepted). File size limit: 1 GB."
            style={{ marginBottom: 10 }}
          >
            <Upload
              maxCount={1}
              beforeUpload={handleBeforeUpload}
              showUploadList={{
                extra: ({ size = 0 }) => (
                  <span style={{ color: "#cccccc" }}>
                    {" "}({formatBytes(size)})
                  </span>
                ),
                showRemoveIcon: true,
              }}
              fileList={fileList}
              onRemove={() => setFileList([])}
              accept={allowedTypes.join(",")}
            >
              <Button icon={<FaUpload />} disabled={loading}>
                Select File
              </Button>
            </Upload>
          </Form.Item>

          <Form.Item<FieldType>
            label="Display Name"
            name="displayName"
            rules={[
              { required: true, message: "Please enter a display name" },
              { validator: displayNameValidator },
            ]}
            extra="The name that will be shown to users (e.g., Windows Build v1.2)"
            style={{ marginBottom: 10 }}
          >
            <Input placeholder="Enter display name" disabled />
          </Form.Item>

          <Form.Item<FieldType>
            label="Platform"
            name="platformId"
            rules={[{ required: true, message: "Please select a platform" }]}
            extra="Select the platform this game file is for"
            style={{ marginBottom: 10 }}
          >
            <Select
              placeholder="Select platform"
              disabled={loading}
              options={platformsOptions}
            ></Select>
          </Form.Item>
          {loading && uploadProgress > 0 && uploadProgress < 100 && (
            <Progress
              percent={uploadProgress}
              status="active"
              style={{ marginBottom: 16 }}
            />
          )}
        </Form>
        {errorMessage && (
          <Alert
            message={errorMessage}
            type="error"
            showIcon
            style={{ marginBottom: 16 }}
          />
        )}
      </Modal>
    </>
  );
};

export default UploadNewFileButton;
