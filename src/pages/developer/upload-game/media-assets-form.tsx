import { getBase64 } from "@/lib/file";
import useManageGameStore from "@/store/use-manage-game-store";
import { GameMediaAssets } from "@/types/game";
import {
  Button,
  Form,
  FormInstance,
  FormProps,
  GetProp,
  Image,
  Input,
  Upload,
  UploadFile,
  UploadProps,
  message,
} from "antd";
import { useEffect, useState } from "react";
import { CiCirclePlus } from "react-icons/ci";
import { HiMiniInboxArrowDown } from "react-icons/hi2";

const { Dragger } = Upload;

type FieldType = GameMediaAssets;

type UploadFileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

const YOUTUBE_REGEX =
  /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[\w-]{11}$/;

const MediaAssetsForm = ({ form }: { form: FormInstance<any> }) => {
  const [coverImageUrl, setCoverImageUrl] = useState<string | undefined>("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const { gameMediaAssets } = useManageGameStore();
  const [messageApi, contextHolder] = message.useMessage();

  const handleChange = ({
    fileList: newFileList,
  }: {
    fileList: UploadFile[];
  }) => {
    if (newFileList.length <= 10) {
      setFileList(newFileList);
    } else {
      messageApi.warning("You can only upload up to 10 images.");
    }
  };

  const beforeUpload = (file: File) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      messageApi.error("You can only upload image files!");
    }
    return false;
  };

  const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
    console.log(values);
  };

  const validateYouTubeUrl = (_: any, value: any) => {
    if (!value || YOUTUBE_REGEX.test(value)) {
      return Promise.resolve();
    }
    return Promise.reject(new Error("Please enter a valid YouTube URL"));
  };

  const props = {
    name: "file",
    multiple: false,
    accept: "image/*",
    maxCount: 1,
    beforeUpload: (file: File) => {
      const isImage = file.type.startsWith("image/");
      if (!isImage) {
        messageApi.error("You can only upload image files!");
        return Upload.LIST_IGNORE;
      }

      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result == "string") {
          setCoverImageUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);

      return false;
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
      file.preview = await getBase64(file.originFileObj as UploadFileType);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  useEffect(() => {
    if (gameMediaAssets.coverImage && gameMediaAssets.coverImage[0]) {
      const file = gameMediaAssets.coverImage[0].originFileObj;
      if (file) {
        const url = URL.createObjectURL(file);
        setCoverImageUrl(url);
      }
    }
  }, []);

  return (
    <Form form={form} layout="vertical" onFinish={onFinish}>
      {contextHolder}
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
        valuePropName="fileList"
        getValueFromEvent={(e) => (Array.isArray(e) ? e : e && e.fileList)}
        extra="Screenshots will appear on your game's page. Upload 3 to 5 for best results."
        rules={[
          {
            validator: (_, value) =>
              value && value.length > 0
                ? Promise.resolve()
                : Promise.reject(new Error("Please select at least one image")),
          },
        ]}
      >
        <Upload
          listType="picture"
          fileList={fileList}
          onChange={handleChange}
          beforeUpload={beforeUpload}
          onPreview={handlePreview}
          accept="image/*"
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
      <Form.Item<FieldType>
        name="videoLink"
        label={<span className="font-bold">Gameplay video or trailer</span>}
        rules={[{ validator: validateYouTubeUrl }]}
        style={{ width: 500, marginBottom: 20 }}
        extra="Provide a link to YouTube"
      >
        <Input placeholder="eg. https://www.youtube.com/watch?v=Xe6v3UJok48" />
      </Form.Item>
    </Form>
  );
};

export default MediaAssetsForm;
