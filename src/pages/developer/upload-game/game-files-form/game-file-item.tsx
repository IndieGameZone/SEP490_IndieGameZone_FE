import { Form, Input, Select, Upload, Button } from "antd";
import { UploadFile } from "antd/es/upload/interface";
import { FaMinus, FaUpload } from "react-icons/fa";
import { allowedTypes } from "./file-upload-helpers";

type Props = {
  name: number;
  index: number;
  remove: (name: number) => void;
  restField: any;
  form: any;
  platforms: { id: string; name: string }[];
  loading: boolean;
  handleBeforeUpload: (file: UploadFile, index: number) => boolean;
};

const GameFileItem = ({
  name,
  index,
  remove,
  restField,
  platforms,
  loading,
  handleBeforeUpload,
}: Props) => (
  <div className="flex flex-col mb-5 border p-3 bg-zinc-800 rounded">
    <Form.Item
      {...restField}
      name={[name, "file"]}
      label="Upload File"
      valuePropName="fileList"
      getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
      rules={[{ required: true, message: "Please upload a file" }]}
      extra="Upload the actual game file (compressed builds are accepted). File size limit: 1 GB."
    >
      <Upload
        maxCount={1}
        showUploadList={{
          showRemoveIcon: true,
          extra: ({ size = 0 }) => (
            <span style={{ color: "#cccccc" }}>
              ({(size / 1024 / 1024).toFixed(2)}MB)
            </span>
          ),
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
      rules={[{ required: true, message: "Please input display name" }]}
      style={{ width: 500 }}
    >
      <Input placeholder="Enter display name" disabled />
    </Form.Item>

    <Form.Item
      {...restField}
      name={[name, "version"]}
      label="Version"
      rules={[{ required: true, message: "Please input the version" }]}
      style={{ width: 500 }}
    >
      <Input placeholder="Enter file version (e.g., v1.0.0)" />
    </Form.Item>

    <Form.Item
      {...restField}
      label="Platform"
      name={[name, "platformId"]}
      rules={[{ required: true, message: "Please select a platform" }]}
      style={{ width: 500 }}
    >
      <Select
        showSearch
        allowClear
        optionFilterProp="label"
        placeholder="Click to view options or type to filter"
        options={platforms.map((x) => ({ value: x.id, label: x.name }))}
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
);

export default GameFileItem;
