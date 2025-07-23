import { GamePost } from "@/types/game-post";
import { Modal } from "antd";
import { MouseEvent } from "react";
import PostCard from "./post-card";

interface PostDetailModalProps {
  post: GamePost | null;
  handleCancel?: (e: MouseEvent) => void;
}
const PostDetailModal = ({ post, handleCancel }: PostDetailModalProps) => {
  return (
    <Modal
      title="Game Post Modal"
      closable
      open={post != null}
      onCancel={handleCancel}
      footer={null}
    >
      {post && <PostCard post={post} />}
      
    </Modal>
  );
};

export default PostDetailModal;
