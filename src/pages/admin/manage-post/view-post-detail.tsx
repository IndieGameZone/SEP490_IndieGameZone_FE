import React, { useState } from "react";
import { Modal, Spin, Typography, Tag, Divider, Image, Row, Col, Avatar, Button, message } from "antd";
import { GamePost } from "@/types/game-post";
import { formatDateTime } from "@/lib/date-n-time";
import { UserOutlined } from "@ant-design/icons";
import { getStatusBadge } from "./columns";
import { FaComment, FaHeart } from "react-icons/fa";
import { ChangePostStatus } from "@/lib/api/game-post-api";
import { useGlobalMessage } from "@/components/message-provider";
import TiptapView from "@/components/tiptap/tiptap-view";

const { Title, Text, Paragraph } = Typography;

interface ViewPostDetailModalProps {
  open: boolean;
  onClose: () => void;
  postId: string | null;
  post: GamePost | null;
  loading: boolean;
  onSuccess?: () => void;
}

const ViewPostDetailModal: React.FC<ViewPostDetailModalProps> = ({ open, onClose, post, loading, onSuccess }) => {
  const [approveLoading, setApproveLoading] = useState(false);
  const [rejectLoading, setRejectLoading] = useState(false);
  const messageApi = useGlobalMessage();
  if (!post && !loading) {
    return null;
  }

  const statusBadge = post?.status ? getStatusBadge(post.status) : { color: "default", text: "Unknown" };

  const isPending =
    post?.status?.toLowerCase() === "pendingaireview" || post?.status?.toLowerCase() === "pendingmanualreview";

  const handleApprove = async () => {
    if (!post?.id) return;

    setApproveLoading(true);
    try {
      const response = await ChangePostStatus(post.id, "Approved");
      if (response.success) {
        messageApi.success("Post has been approved successfully!");
        onSuccess?.();
        onClose();
      } else {
        messageApi.error(response.error || "Failed to approve post");
      }
    } catch (error) {
      messageApi.error("An error occurred while approving the post");
      console.error(error);
    } finally {
      setApproveLoading(false);
    }
  };

  const handleReject = async () => {
    if (!post?.id) return;

    setRejectLoading(true);
    try {
      const response = await ChangePostStatus(post.id, "Rejected");
      if (response.success) {
        messageApi.success("Post has been rejected successfully!");
        onSuccess?.();
        onClose();
      } else {
        messageApi.error(response.error || "Failed to reject post");
      }
    } catch (error) {
      messageApi.error("An error occurred while rejecting the post");
      console.error(error);
    } finally {
      setRejectLoading(false);
    }
  };

  return (
    <>
      <Modal
        open={open}
        onCancel={onClose}
        footer={null}
        width={800}
        title={
          <div className="flex justify-between items-center">
            <span>Post Details</span>
          </div>
        }
      >
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Spin size="large" />
          </div>
        ) : (
          <div className="post-detail-content max-h-[70vh] overflow-y-auto pr-2">
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <div className="mb-4">
                  <Text type="secondary">Post Creator</Text>
                  <div className="flex items-center mt-1">
                    <Avatar icon={<UserOutlined />} src={post?.user?.avatar} size="small" className="mr-2" />
                    <Text strong>{post?.user?.userName || "Unknown User"}</Text>
                  </div>
                  {post?.user?.email && <div className="ml-6 text-xs text-gray-500">{post.user.email}</div>}
                </div>
              </Col>

              <Col span={12}>
                <div className="mb-4">
                  <Text type="secondary">Game</Text>
                  <div className="mt-1">
                    <Text strong>{post?.game?.name || "Unknown Game"}</Text>
                  </div>
                </div>
              </Col>
            </Row>

            <Row gutter={[16, 16]}>
              <Col span={12}>
                <div className="mb-4">
                  <Text type="secondary">Created At</Text>
                  <div className="mt-1 text-sm">
                    {post?.createdAt ? formatDateTime(new Date(post.createdAt)) : "N/A"}
                  </div>
                </div>
              </Col>
              <Col span={12}>
                <div className="">
                  <Text type="secondary">Status</Text>
                </div>
                {post?.status && (
                  <Tag color={statusBadge.color} className="text-base px-2 py-1">
                    {statusBadge.text}
                  </Tag>
                )}
              </Col>
            </Row>

            <Divider />

            <div className="mb-4">
              <div>
                <Text type="secondary">Post Title</Text>
                <Paragraph className="mb-4">{post?.title || "Untitled Post"}</Paragraph>
              </div>
              <Title level={5}>Post Content</Title>
              <div className="bg-gray-50 p-3 rounded border mt-2">
                <TiptapView value={post?.content || "No content available"} darkTheme={false} />
              </div>
            </div>

            {post?.postImages && post.postImages.length > 0 && (
              <div className="mb-4">
                <Title level={5}>Images</Title>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {post.postImages.map((img, index) => (
                    <div key={index}>
                      <Image
                        src={img.image}
                        alt={`Post image ${index + 1}`}
                        style={{ height: 150, objectFit: "cover" }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {post?.postTags && post.postTags.length > 0 && (
              <div className="mb-4">
                <Title level={5}>Tags</Title>
                <div className="flex flex-wrap gap-1 mt-2">
                  {post.postTags.map((tag, index) => (
                    <Tag key={index}>{tag.tag?.name || "Unknown"}</Tag>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <div className="flex items-center gap-1">
                <FaHeart />
                <span>{post?.numberOfLikes || 0}</span>
              </div>
              <div className="flex items-center gap-1">
                <FaComment />
                <span>{post?.numberOfComments || 0} </span>
              </div>
            </div>

            {isPending && (
              <div className="flex my-5 gap-10">
                <Button type="primary" onClick={handleApprove} loading={approveLoading} disabled={rejectLoading}>
                  Approve
                </Button>
                <Button type="primary" danger onClick={handleReject} loading={rejectLoading} disabled={approveLoading}>
                  Reject
                </Button>
              </div>
            )}
          </div>
        )}
      </Modal>
    </>
  );
};

export default ViewPostDetailModal;
