import TiptapEditor from "@/components/tiptap/tiptap-editor";
import usePlatformStore from "@/store/use-platform-store";
import { GameFiles } from "@/types/game";
import {
  Alert,
  Button,
  Form,
  FormInstance,
  FormProps,
  Input,
  Select,
  Upload,
  UploadFile,
  message,
} from "antd";
import { useEffect, useState } from "react";
import { FaMinus, FaPlus, FaUpload } from "react-icons/fa";

type FieldType = GameFiles;

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

const GameFilesForm = ({ form }: { form: FormInstance<any> }) => {
  const { fetchPlatforms, platforms, loading, getDefaultPlatforms } =
    usePlatformStore();
  const [messageApi, contextHolder] = message.useMessage();
  const [filesError, setFilesError] = useState("");

  const filesValidator = async (_: any, files: any) => {
    if (!files || files.length < 1) {
      return Promise.reject(new Error("At least one file is required"));
    }

    const entries = files
      .map((f: any) => ({
        displayName: f?.displayName?.trim(),
        platformId: f?.platformId,
        version: f?.version?.trim(),
      }))
      .filter((f: any) => f.displayName);

    // Group by displayName
    const duplicates = new Set<string>();
    const seen = new Map<string, Set<string>>(); // Map of displayName -> Set of "platformId-version" combos

    for (const { displayName, platformId, version } of entries) {
      const comboKey = `${platformId || "none"}-${version || "none"}`;
      if (!seen.has(displayName)) {
        seen.set(displayName, new Set([comboKey]));
      } else {
        const existingCombos = seen.get(displayName)!;
        if (existingCombos.has(comboKey)) {
          duplicates.add(displayName);
        } else {
          existingCombos.add(comboKey);
        }
      }
    }

    if (duplicates.size > 0) {
      const message = `Each file with the same name must have a unique combination of platform or version. Duplicates found for: ${[
        ...duplicates,
      ].join(", ")}`;
      setFilesError(message);
      return Promise.reject(new Error(message));
    }

    return Promise.resolve();
  };

  const normFile = (e: any) => {
    if (Array.isArray(e)) return e;
    return e?.fileList;
  };

  const onFinish: FormProps<FieldType>["onFinish"] = () => {};

  useEffect(() => {
    fetchPlatforms();
  }, []);

  const handleBeforeUpload = (file: UploadFile, index: number) => {
    const isAllowed = allowedTypes.some((type) =>
      file.name.toLowerCase().endsWith(type)
    );

    if (!isAllowed) {
      messageApi.error(
        `${file.name} is not a valid executable or compressed file`
      );
      return false;
    }
    const fileExtension = file.name.split(".").pop();
    const defaultPlatforms = getDefaultPlatforms();
    var platform = "";
    if (fileExtension == "exe") {
      platform = defaultPlatforms.windowsPlatformId ?? "";
    }

    const currentList = form.getFieldValue("files") || [];
    const currentItem = currentList[index] || {};
    const updatedList = [...currentList];
    updatedList[index] = {
      ...currentItem,
      displayName: file.name,
      fileSize: file.size ?? 0,
      file: [file],
      platformId: platform.length ? platform : undefined,
    };
    form.setFieldsValue({ files: updatedList });
    setFilesError("");
    return false; // Prevent automatic upload
  };

  const handleFormChange = (changedValues: any) => {
    if (changedValues.files !== undefined) {
      form.validateFields(["files"]);
    }
  };

  return (
    <Form
      form={form}
      onFinish={onFinish}
      layout="vertical"
      autoComplete="off"
      onValuesChange={handleFormChange}
    >
      {contextHolder}
      <Form.List
        name="files"
        rules={[
          {
            validator: filesValidator,
          },
        ]}
      >
        {(fields, { add, remove }, { errors }) => (
          <>
            {fields.map(({ key, name, ...restField }, index) => (
              <div
                key={key}
                className="flex flex-col mb-5 border p-3 bg-zinc-800 rounded"
              >
                <Form.Item
                  {...restField}
                  name={[name, "file"]}
                  label="Upload File"
                  valuePropName="fileList"
                  getValueFromEvent={normFile}
                  rules={[{ required: true, message: "Please upload a file" }]}
                  style={{ marginBottom: 10 }}
                  extra="Upload the actual game file (compressed builds are accepted). File size limit: 1 GB."
                >
                  <Upload
                    maxCount={1}
                    showUploadList={{
                      extra: ({ size = 0 }) => (
                        <span style={{ color: "#cccccc" }}>
                          {" "}
                          ({(size / 1024 / 1024).toFixed(2)}MB)
                        </span>
                      ),
                      showRemoveIcon: true,
                    }}
                    beforeUpload={(file) => handleBeforeUpload(file, index)}
                    accept={allowedTypes.join(",")}
                  >
                    <Button icon={<FaUpload />}>Select File</Button>
                  </Upload>
                </Form.Item>
                <Form.Item
                  {...restField}
                  name={[name, "displayName"]}
                  label="Display Name"
                  extra="The name that will be shown to users (e.g., Windows Build v1.2)"
                  rules={[
                    { required: true, message: "Please input display name" },
                  ]}
                  style={{ width: 500, marginBottom: 5 }}
                >
                  <Input placeholder="Enter display name" disabled />
                </Form.Item>
                <Form.Item
                  {...restField}
                  name={[name, "version"]}
                  label="Version"
                  extra="e.g. v1.0.3, build-22, alpha-1"
                  rules={[
                    { required: true, message: "Please input the version" },
                  ]}
                  style={{ width: 500, marginBottom: 5 }}
                >
                  <Input placeholder="Enter file version (e.g., v1.0.0)" />
                </Form.Item>
                <Form.Item
                  {...restField}
                  label={<span className="font-bold">Platform</span>}
                  name={[name, "platformId"]}
                  extra="Select the platform this game file is for"
                  rules={[
                    { required: true, message: "Please select a platform" },
                  ]}
                  style={{ width: 500, marginBottom: 20 }}
                >
                  <Select
                    showSearch
                    allowClear
                    optionFilterProp="label"
                    placeholder="Click to view options or type to filter"
                    options={platforms.map((x) => ({
                      value: x.id,
                      label: x.name,
                    }))}
                    loading={loading}
                  />
                </Form.Item>
                <Button
                  danger
                  type="default"
                  onClick={() => remove(name)}
                  icon={<FaMinus />}
                >
                  Remove
                </Button>
              </div>
            ))}
            {/* <Form.ErrorList errors={errors} className="text-red-400 mb-1" /> */}
            {errors.length > 0 && (
              <Alert
                message={filesError}
                type="error"
                showIcon
                style={{ marginBottom: 16 }}
              />
            )}
            <Form.Item>
              <Button
                type="dashed"
                onClick={() => add()}
                block
                icon={<FaPlus />}
                disabled={fields.length >= 6}
              >
                Add File
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>
      <Form.Item<FieldType>
        name="installInstruction"
        label={<span className="font-bold">Install instructions</span>}
        extra="Help players install your game on their specific platform"
      >
        <TiptapEditor />
      </Form.Item>
    </Form>
  );
};

export default GameFilesForm;
