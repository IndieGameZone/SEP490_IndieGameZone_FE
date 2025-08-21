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
  version: string;
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
  const [isScanning, setIsScanning] = useState(false);

  const platformsOptions = useMemo(() => {
    return platforms.map((x) => ({ value: x.id, label: x.name }));
  }, [platforms]);

  const displayNameValidator = async (_: any, value: string) => {
    const version = form.getFieldValue("version");
    const platformId = form.getFieldValue("platformId");
    const uploadedFile = fileList[0];

    const isDuplicate = gameFiles.some(
      (x) =>
        x.displayName === value &&
        x.version === version &&
        x.platform.id === platformId
    );

    if (isDuplicate) {
      return Promise.reject(
        new Error(
          "A file with the same display name, version, and platform already exists! Please change one of them"
        )
      );
    }

    if (uploadedFile) {
      const originalName = uploadedFile.name;
      const originalExt = originalName
        .substring(originalName.lastIndexOf("."))
        .toLowerCase();
      const displayExt = value.substring(value.lastIndexOf(".")).toLowerCase();

      if (originalExt !== displayExt) {
        return Promise.reject(
          new Error(
            `Display name extension must match the uploaded file extension (${originalExt})`
          )
        );
      }
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
    setFileUrl(null);
    return false;
  };

  const uploadFileToAPI = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axiosClient.post("/api/files", formData, {
        onUploadProgress: (progressEvent) => {
          const percent = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total || 1)
          );
          setUploadProgress(percent);

          if (percent === 100) {
            setIsScanning(true);
          }
        },
      });
      setIsScanning(false);
      return response.data;
    } catch (error: any) {
      setIsScanning(false);
      if (
        error.response?.status === 400 &&
        error.response?.data?.detail ===
          "File scan failed. Please ensure the file is safe and appropriate."
      ) {
        throw new Error(
          "The file couldn't be uploaded because it didn't pass our safety check. Please make sure the file is safe and try again."
        );
      } else {
        throw new Error(
          "Something went wrong! Please try again."
        );
      }
    }
  };

  const submitFormData = async (data: FieldType, fileUrl: string) => {
    if (!game) return;
    const result = await addGameFiles(game.id, [
      {
        file: fileUrl,
        platformId: data.platformId,
        version: data.version,
        displayName: data.displayName,
      },
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
      messageApi.error(
        err.message || "Something went wrong! Please try again."
      );
      setErrorMessage(err.message || "Something went wrong! Please try again.");
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

  const handleFormChange = (changedValues: any) => {
    if (changedValues !== undefined) {
      form.validateFields(["displayName"]);
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
        forceRender
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          onValuesChange={handleFormChange}
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
                    {" "}
                    ({formatBytes(size)})
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
            <Input placeholder="Enter display name" />
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
          <Form.Item<FieldType>
            label="Version"
            name="version"
            rules={[{ required: true, message: "Please enter a version" }]}
            extra="Specify the version of this build (like v1.0, v2.3-beta etc.)"
            style={{ marginBottom: 10 }}
          >
            <Input
              placeholder="Enter version (e.g. v1.0.2)"
              disabled={loading}
            />
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
        {loading && isScanning && (
          <Alert
            message="Upload complete, scanning file on server..."
            type="info"
            showIcon
            style={{ marginBottom: 16 }}
          />
        )}
      </Modal>
    </>
  );
};

export default UploadNewFileButton;
