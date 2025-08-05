import { useState } from "react";
import { FaSmile } from "react-icons/fa";
import { Button, Form, FormProps } from "antd";
import { IoMdSend } from "react-icons/io";
import TextArea from "antd/es/input/TextArea";
import EmojiPicker from "@/components/emoji-picker";
import { createPostComment } from "@/lib/api/game-post-api";
import useAuthStore from "@/store/use-auth-store";
import { useGlobalMessage } from "@/components/message-provider";
import { Link } from "react-router-dom";

type FieldType = {
  comment?: string;
};

interface PostCommentFormProps {
  postId: string | null;
  onSubmit: () => void;
}

const PostCommentForm = ({ onSubmit, postId }: PostCommentFormProps) => {
  const [form] = Form.useForm<FieldType>();
  const [showPicker, setShowPicker] = useState(false);
  const { profile } = useAuthStore();
  const messageApi = useGlobalMessage();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEmojiSelect = (emoji: any) => {
    form.setFieldValue("comment", form.getFieldValue("comment") + emoji);
  };

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    if (!postId || !profile || !values.comment) return;
    setIsSubmitting(true);
    const result = await createPostComment(profile.id, postId, values.comment);
    setIsSubmitting(false);
    if (result.error) {
      messageApi.error("Failed to post comment! Please try again.");
    } else {
      form.resetFields();
      messageApi.success("Comment posted successfully!");
      onSubmit();
    }
  };

  const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (
    errorInfo
  ) => {
    console.log("Failed:", errorInfo);
  };

  const currentComment = Form.useWatch("comment", form);
  if (!profile)
    return (
      <div className="text-zinc-500 text-center">
        <Link to="/log-in" className="font-semibold">
          Login
        </Link>{" "}
        to post a comment
      </div>
    );
  return (
    <div className="p-3 relative">
      <Form
        name="basic"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        form={form}
      >
        <div className="flex items-start gap-2 mt-2">
          <Form.Item<FieldType>
            name="comment"
            className="w-full"
            style={{ marginBottom: 0 }}
          >
            <TextArea
              className="w-full p-2 border rounded resize-none"
              placeholder="Write your comment..."
              size="large"
              autoSize={{ minRows: 1, maxRows: 6 }}
            />
          </Form.Item>

          <div className="relative">
            <Button
              htmlType="button"
              onClick={() => {
                setShowPicker((prev) => !prev);
              }}
              shape="circle"
              icon={<FaSmile />}
              size="large"
            />

            {showPicker && (
              <EmojiPicker
                onSelect={handleEmojiSelect}
                onClose={() => setShowPicker(false)}
              />
            )}
          </div>
          <Form.Item label={null} style={{ marginBottom: 0 }}>
            <Button
              htmlType="submit"
              icon={<IoMdSend />}
              shape="circle"
              type="primary"
              size="large"
              disabled={postId == null || !currentComment}
              loading={isSubmitting}
            />
          </Form.Item>
        </div>
      </Form>
    </div>
  );
};

export default PostCommentForm;
