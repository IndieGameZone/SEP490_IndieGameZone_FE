import { useState } from "react";
import {
  Button,
  Modal,
  Input,
  Upload,
  Select,
  Form,
  FormProps,
  UploadFile,
} from "antd";
import { FaPlus } from "react-icons/fa";
import TiptapEditor from "@/components/tiptap/tiptap-editor";
import { useForm } from "antd/es/form/Form";
import { useGlobalMessage } from "@/components/message-provider";
import { HiMiniInboxArrowDown } from "react-icons/hi2";
import useTagStore from "@/store/use-tag-store";
import { uploadFile } from "@/lib/api/file-api";
import { createPost } from "@/lib/api/post-game-api";
import useAuthStore from "@/store/use-auth-store";
import useGameStore from "@/store/use-game-store";

const { Dragger } = Upload;

type FieldType = {
  title: string;
  description: string;
  images: UploadFile[];
  tags: string[];
};

const MAX_IMAGES = 10;

const DRAFT_KEY = "create_post_draft";

const CreatePostButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = useForm<FieldType>();
  const messageApi = useGlobalMessage();
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { profile } = useAuthStore();
  const { game } = useGameStore();
  const { tags } = useTagStore();

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    if (!game) return;
    if (!profile) {
      messageApi.error("Login to continue.");
      return;
    }
    const { title, description, images, tags } = values;
    setIsSubmitting(true);
    const uploadedImageUrls: string[] = [];
    for (const file of images || []) {
      if (!file.originFileObj) {
        messageApi.error("Unexpected error occur! Please try again.");
        return;
      }
      const { data } = await uploadFile(file.originFileObj);
      uploadedImageUrls.push(data);
    }

    const result = await createPost(profile.id, game.id, {
      Content: description,
      Images: uploadedImageUrls,
      Tags: tags,
      Title: title,
    });
    if (result.error) {
      messageApi.error("Failed to create post! Please try again.");
    } else {
      messageApi.error("Post created successfully!");
      localStorage.removeItem(DRAFT_KEY);
      setTimeout(() => {
        form.resetFields();
        handleCancel();
      }, 1000);
    }
    setIsSubmitting(false);
  };

  const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (
    errorInfo
  ) => {
    console.log("Failed:", errorInfo);
  };

  const showModal = () => {
    setIsModalOpen(true);
    const draft = localStorage.getItem(DRAFT_KEY);
    if (draft) {
      try {
        const parsed = JSON.parse(draft);
        form.setFieldsValue({
          title: parsed.title || "",
          description: parsed.description || "",
          tags: parsed.tags || [],
        });
      } catch (err) {
        console.error("Failed to parse draft", err);
      }
    }
  };

  const handleOk = () => {
    form.submit();
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleImageCancel = () => {
    setPreviewVisible(false);
    setPreviewImage("");
    setPreviewTitle("");
  };

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj as File);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
      });
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewVisible(true);
    setPreviewTitle(file.name || "Image Preview");
  };

  const handleSaveAsDraft = async () => {
    try {
      const values = await form.validateFields([
        "title",
        "description",
        "tags",
      ]);
      const draftData = {
        title: values.title,
        description: values.description,
        tags: values.tags,
      };
      localStorage.setItem(DRAFT_KEY, JSON.stringify(draftData));
      messageApi.success("Draft saved locally");
    } catch {
      messageApi.error("Please fix the errors before saving as draft");
    }
  };

  return (
    <>
      <Button
        type="primary"
        style={{ paddingInline: "2rem" }}
        icon={<FaPlus />}
        onClick={showModal}
      >
        create post
      </Button>
      <Modal
        title="Create a new post"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        width={700}
        okText="Post"
        cancelText="Cancel"
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button key="draft" onClick={handleSaveAsDraft}>
            Save as draft
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={handleOk}
            loading={isSubmitting}
          >
            Post
          </Button>,
        ]}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item<FieldType>
            name="title"
            label={<p className="font-semibold">Title</p>}
            rules={[
              { required: true, message: "Please enter the title" },
              {
                min: 2,
                message: "Title must be at least 2 characters",
              },
            ]}
          >
            <Input placeholder="What's on your mind?" />
          </Form.Item>

          <Form.Item<FieldType>
            name="description"
            label={<p className="font-semibold">Description</p>}
          >
            <TiptapEditor />
          </Form.Item>

          <Form.Item<FieldType>
            name="images"
            label={<p className="font-semibold">Images</p>}
            valuePropName="fileList"
            getValueFromEvent={(e) => {
              if (Array.isArray(e)) {
                return e;
              }
              return e?.fileList;
            }}
          >
            <Dragger
              name="images"
              multiple
              listType="picture"
              accept=".png,.jpg,.jpeg,.webp"
              maxCount={MAX_IMAGES}
              beforeUpload={(file: File) => {
                const isAllowedType =
                  file.type === "image/png" ||
                  file.type === "image/jpeg" ||
                  file.type === "image/webp";

                if (!isAllowedType) {
                  messageApi.error(
                    "Only PNG, JPG, JPEG, and WEBP files are allowed!"
                  );
                  return Upload.LIST_IGNORE;
                }
                return false;
              }}
              onPreview={handlePreview}
            >
              <p className="flex justify-center py-5">
                <HiMiniInboxArrowDown className="size-18" />
              </p>
              <p className="ant-upload-text">
                Click or drag images here to upload
              </p>
              <p className="ant-upload-hint">
                Support PNG, JPG, JPEG, and WEBP formats.
              </p>
            </Dragger>
          </Form.Item>

          <Form.Item<FieldType>
            name="tags"
            label={<p className="font-semibold">Tags</p>}
          >
            <Select
              mode="tags"
              style={{ width: "100%" }}
              placeholder="Add relevant tags"
              allowClear
              options={tags.map((x) => ({
                value: x.id,
                label: x.name,
              }))}
            />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        open={previewVisible}
        title={previewTitle}
        footer={null}
        onCancel={handleImageCancel}
      >
        <img
          alt="preview"
          style={{ width: "100%", borderRadius: "0.5rem" }}
          src={previewImage}
        />
      </Modal>
    </>
  );
};

export default CreatePostButton;
