import { useGlobalMessage } from "@/components/message-provider";
import { deleteComment } from "@/lib/api/game-post-api";
import useAuthStore from "@/store/use-auth-store";
import usePostStore from "@/store/use-game-post-store";
import { Button, Modal } from "antd";
import { useState } from "react";

interface DeleteCommentConfirmationModalProps {
  open: boolean;
  postId: string;
  commentId: string | null;
  onCancel: () => void;
  onDeleteFinish: () => void;
}
const DeleteCommentConfirmationModal = ({
  open,
  postId,
  commentId,
  onCancel,
  onDeleteFinish,
}: DeleteCommentConfirmationModalProps) => {
  const { profile } = useAuthStore();
  const messageApi = useGlobalMessage();
  const [loading, setLoading] = useState(false);
  const { deleteComment: deleteStoredComment } = usePostStore();
  const handleDeleteComment = async () => {
    if (!profile || !commentId) return;
    setLoading(true);
    const result = await deleteComment(profile.id, commentId);
    setLoading(false);
    if (result.error) {
      messageApi.error("Failed to delete comment. Please try again!");
    } else {
      messageApi.success("Comment deleted successfully!");
      onDeleteFinish();
      deleteStoredComment(postId, commentId);
    }
  };
  return (
    <Modal
      title="Delete comment"
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
          onClick={handleDeleteComment}
          loading={loading}
          danger
        >
          Yes, delete it
        </Button>,
      ]}
    >
      <p>Are you sure you want to delete this comment?</p>
    </Modal>
  );
};

export default DeleteCommentConfirmationModal;
