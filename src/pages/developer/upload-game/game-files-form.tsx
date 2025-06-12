import TiptapEditor from "@/components/tiptap/tiptap-editor";
import usePlatformStore from "@/store/use-platform-store";
import { GameFiles } from "@/types/game";
import {
  Button,
  Form,
  FormInstance,
  FormProps,
  Input,
  Select,
  Upload,
  UploadFile,
} from "antd";
import { useEffect } from "react";
import { FaMinus, FaPlus, FaUpload } from "react-icons/fa";

type FieldType = GameFiles;

const GameFilesForm = ({ form }: { form: FormInstance<any> }) => {
  const { fetchPlatforms, platforms, loading } = usePlatformStore();

  const normFile = (e: any) => {
    if (Array.isArray(e)) return e;
    return e?.fileList;
  };

  const onFinish: FormProps<FieldType>["onFinish"] = () => {};

  useEffect(() => {
    fetchPlatforms();
  }, []);

  const handleBeforeUpload = (file: UploadFile, index: number) => {
    const currentList = form.getFieldValue("files") || [];
    const currentItem = currentList[index] || {};
    const updatedList = [...currentList];
    updatedList[index] = {
      ...currentItem,
      displayName: file.name,
      fileSize: file.size ?? 0,
      file: [file], // store the file in antd Upload-compatible format
    };
    form.setFieldsValue({ files: updatedList });
    return false; // Prevent automatic upload
  };

  return (
    <Form form={form} onFinish={onFinish} layout="vertical" autoComplete="off">
      <Form.List
        name="files"
        rules={[
          {
            validator: async (_, files) => {
              if (!files || files.length < 1) {
                return Promise.reject(
                  new Error("At least one file is required")
                );
              }
            },
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
                          &nbsp;({(size / 1024 / 1024).toFixed(2)}MB)
                        </span>
                      ),
                      showRemoveIcon: true,
                    }}
                    beforeUpload={(file) => handleBeforeUpload(file, index)}
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
                  label={<span className="font-bold">Platform</span>}
                  name={[name, "platformId"]}
                  extra="Select the platform this game file is for"
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
            <Form.ErrorList errors={errors} className="text-red-400 mb-1" />
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
        label={<span className="font-bold">Install instruction</span>}
        extra="Help players install your game on their specific platform"
      >
        <TiptapEditor />
      </Form.Item>
    </Form>
  );
};

export default GameFilesForm;
