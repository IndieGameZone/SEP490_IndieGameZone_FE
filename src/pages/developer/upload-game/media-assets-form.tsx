import {
  Button,
  Form,
  FormProps,
  GetProp,
  Image,
  Upload,
  UploadFile,
  UploadProps,
  message,
} from "antd";
import { useState } from "react";
import { CiCirclePlus } from "react-icons/ci";
import { HiMiniInboxArrowDown } from "react-icons/hi2";

const { Dragger } = Upload;

type FieldType = {
  coverImage: UploadFile[];
  gameImages: UploadFile[];
};

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

const getBase64 = (file: FileType): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

const MediaAssetsForm = () => {
  const [form] = Form.useForm();
  const [coverImageUrl, setCoverImageUrl] = useState<string | undefined>("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const handleChange = ({
    fileList: newFileList,
  }: {
    fileList: UploadFile[];
  }) => {
    if (newFileList.length <= 10) {
      setFileList(newFileList);
    } else {
      message.warning("You can only upload up to 10 images.");
    }
  };

  const beforeUpload = (file: File) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      message.error("You can only upload image files!");
    }
    return false;
  };

  const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
    console.log(values);
  };

  const props = {
    name: "file",
    multiple: false,
    accept: "image/*",
    maxCount: 1,
    beforeUpload: (file: File) => {
      const isImage = file.type.startsWith("image/");
      if (!isImage) {
        message.error("You can only upload image files!");
        return Upload.LIST_IGNORE;
      }

      // Preview
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result == "string") {
          setCoverImageUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);

      return false; // prevent auto upload
    },
    onRemove: () => {
      setCoverImageUrl(undefined);
    },
    showUploadList: {
      extra: ({ size = 0 }) => (
        <span style={{ color: "#cccccc" }}>
          &nbsp;({(size / 1024 / 1024).toFixed(2)}MB)
        </span>
      ),
      showRemoveIcon: true,
    },
  };

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };
  return (
    <Form form={form} layout="vertical" onFinish={onFinish}>
      <Form.Item<FieldType>
        label={<span className="font-bold">Cover Image</span>}
        name="coverImage"
        rules={[{ required: true, message: "Please select an image!" }]}
        valuePropName="fileList"
        getValueFromEvent={(e) => (Array.isArray(e) ? e : e && e.fileList)}
        extra="Upload a cover image for your game (JPEG/PNG). This will be shown in listings and on the game page."
      >
        <Dragger {...props}>
          <p className="flex justify-center py-5">
            <HiMiniInboxArrowDown className="size-18" />
          </p>
          <p className="ant-upload-text">
            Click or drag image to this area to upload
          </p>
          <p className="ant-upload-hint">Supports only image files.</p>
        </Dragger>
      </Form.Item>

      {coverImageUrl && (
        <Form.Item
          label={<span className="font-bold">Review Cover Image</span>}
        >
          <Image
            width={200}
            src={coverImageUrl}
            alt="Preview"
            fallback="https://via.placeholder.com/200?text=Invalid+Image"
          />
        </Form.Item>
      )}
      <Form.Item<FieldType>
        label={<span className="font-bold">Game Screenshots</span>}
        name={"gameImages"}
        extra="Screenshots will appear on your game's page. Optional but highly recommended. Upload 3 to 5 for best results."
      >
        <Upload
          listType="picture"
          fileList={fileList}
          onChange={handleChange}
          beforeUpload={beforeUpload}
          onPreview={handlePreview}
          maxCount={10}
          multiple
          showUploadList={{
            extra: ({ size = 0 }) => (
              <span style={{ color: "#cccccc" }}>
                &nbsp;({(size / 1024 / 1024).toFixed(2)}MB)
              </span>
            ),
            showRemoveIcon: true,
          }}
        >
          {fileList.length < 10 && (
            <Button icon={<CiCirclePlus className="size-6" />}>
              Select Image Files
            </Button>
          )}
        </Upload>
      </Form.Item>
      {previewImage && (
        <Image
          wrapperStyle={{ display: "none" }}
          preview={{
            visible: previewOpen,
            onVisibleChange: (visible) => setPreviewOpen(visible),
            afterOpenChange: (visible) => !visible && setPreviewImage(""),
          }}
          src={previewImage}
        />
      )}
    </Form>
  );
};

export default MediaAssetsForm;
