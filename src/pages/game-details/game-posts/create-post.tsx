import { useState } from "react";
import { Form, Input, message, Select, Upload, Image, Button } from "antd";
import { UploadFile, UploadProps } from "antd";
import { CiCirclePlus } from "react-icons/ci";
import TiptapEditor from "@/components/tiptap/tiptap-editor";
import { getBase64 } from "@/lib/file";
import { PostGame } from "@/types/post-game";
import { createPost } from "@/lib/api/post-game-api";

type FieldType = PostGame & { gameImages: UploadFile[] }; // Extend PostGame to include gameImages
type UploadFileType = File;

const CreatePost = ({ userId, gameId, onCancel }: { userId: string; gameId: string; onCancel: () => void }) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [messageApi, contextHolder] = message.useMessage();

  const handlePreview = async (file: UploadFile) => {
    try {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj as UploadFileType);
      }
      setPreviewImage(file.url || (file.preview as string));
      setPreviewOpen(true);
    } catch (error) {
      messageApi.error("Failed to preview image!");
    }
  };

  const handleChange: UploadProps["onChange"] = ({ fileList: newFileList }) => {
    if (newFileList.length <= 10) {
      setFileList(newFileList);
    } else {
      messageApi.warning("You can only upload up to 10 images.");
    }
  };

  const beforeUpload = (file: File) => {
    const isAllowedType =
      file.type === "image/png" ||
      file.type === "image/jpeg" ||
      file.type === "image/webp";
    if (!isAllowedType) {
      messageApi.error("Only PNG, JPG, JPEG, and WEBP files are allowed!");
      return Upload.LIST_IGNORE;
    }
    return false;
  };

  const onFinish = async (values: FieldType) => {
    try {
      // Convert the first image to base64 (assuming API expects a single image)
      const image = fileList.length > 0 ? await getBase64(fileList[0].originFileObj as File) : "";

      const postData: PostGame = {
        Title: values.Title,
        Content: values.Content,
        Image: image,
        Tags: values.Tags || [],
      };

      const response = await createPost(userId, gameId, postData);

      if (response.success) {
        messageApi.success("Post created successfully!");
        form.resetFields();
        setFileList([]);
        setPreviewImage("");
        setPreviewOpen(false);
      } else {
        messageApi.error(response.error || "Failed to create post.");
      }
    } catch (error) {
      messageApi.error("An unexpected error occurred while creating the post.");
    }
  };

  return (
    <div className="px-3 py-4">
      {contextHolder}
      <h2>Create New Post</h2>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          label={<span className="font-bold">Post Title</span>}
          name="title"
          rules={[{ required: true, message: "Please enter a title" }]}
        >
          <Input.TextArea placeholder="Enter post title" />
        </Form.Item>
        <Form.Item
          label={<span className="font-bold">Content</span>}
          name="content"
          rules={[{ required: true, message: "Please enter content" }]}
        >
          <TiptapEditor />
        </Form.Item>
        <Form.Item label={<span className="font-bold">Tags</span>} name="tags">
          <Select
            mode="multiple"
            placeholder="Select tags"
            options={[
              { label: "Announcement", value: "Announcement" },
              { label: "Bug", value: "Bug" },
              { label: "Discussion", value: "Discussion" },
              { label: "Question", value: "Question" },
              { label: "Guide", value: "Guide" },
            ]}
          />
        </Form.Item>
        <Form.Item
          label={<span className="font-bold">Post Image</span>}
          name="gameImages"
          valuePropName="fileList"
          getValueFromEvent={(e) => (Array.isArray(e) ? e : e && e.fileList)}
          extra="Screenshots will appear on your game's page. Upload 3 to 5 for best results."
          
        >
          <Upload
            listType="picture"
            fileList={fileList}
            onChange={handleChange}
            beforeUpload={beforeUpload}
            onPreview={handlePreview}
            accept=".png,.jpg,.jpeg,.webp"
            maxCount={10}
            multiple
            showUploadList={{
              showRemoveIcon: true,
              extra: ({ size = 0 }) => (
                <span style={{ color: "#cccccc" }}>
                  ({(size / 1024 / 1024).toFixed(2)}MB)
                </span>
              ),
            }}
          >
            {fileList.length < 10 && (
              <Button icon={<CiCirclePlus className="size-6" />}>
                Select Image Files
              </Button>
            )}
          </Upload>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
          <Button
            style={{ marginLeft: 8 }}
            onClick={() => {
              form.resetFields();
              setFileList([]);
              setPreviewImage("");
              setPreviewOpen(false);
              onCancel();
            }}
          >
            Cancel
          </Button>
        </Form.Item>
      </Form>
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
    </div>
  );
};

export default CreatePost;