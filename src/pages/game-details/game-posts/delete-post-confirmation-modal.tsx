import { useGlobalMessage } from "@/components/message-provider";
import { deletePost } from "@/lib/api/game-post-api";
import useAuthStore from "@/store/use-auth-store";
import { Button, Modal } from "antd";
import { useState } from "react";

interface DeletePostConfirmationModalProps {
  open: boolean;
  postId: string | null;
  onCancel: () => void;
  onDeleteFinish: () => void;
  rerender: () => void;
}
const DeletePostConfirmationModal = ({
  open,
  postId,
  onCancel,
  onDeleteFinish,
  rerender,
}: DeletePostConfirmationModalProps) => {
  const { profile } = useAuthStore();
  const messageApi = useGlobalMessage();
  const [loading, setLoading] = useState(false);
  const handleDeletePost = async () => {
    if (!profile || !postId) return;
    setLoading(true);
    const result = await deletePost(profile.id, postId);
    setLoading(false);
    if (result.error) {
      messageApi.error("Failed to delete post. Please try again!");
    } else {
      messageApi.success("Post deleted successfully!");
      onDeleteFinish();
      setTimeout(() => {
        rerender();
      }, 1000);
    }
  };
  return (
    <Modal
      title="Delete Post"
      open={open}
      onCancel={onCancel}
      zIndex={9999}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="default"
          onClick={handleDeletePost}
          loading={loading}
          danger
        >
          Yes, delete it
        </Button>,
      ]}
    >
      <p>Are you sure you want to delete this post?</p>
    </Modal>
  );
};

export default DeletePostConfirmationModal;
