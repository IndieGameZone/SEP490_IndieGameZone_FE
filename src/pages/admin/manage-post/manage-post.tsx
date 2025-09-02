import React, { useEffect, useState, useCallback } from "react";
import { Table, Typography, message } from "antd";
import { GamePost } from "@/types/game-post";
import { getAllPostColumns } from "./columns";
import { getAllPost, getPostById } from "@/lib/api/game-post-api";
import ViewPostDetailModal from "./view-post-detail";

const { Title } = Typography;

const ManagePost: React.FC = () => {
  const [posts, setPosts] = useState<GamePost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [messageApi, contextHolder] = message.useMessage();
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [selectedPost, setSelectedPost] = useState<GamePost | null>(null);
  const [modalLoading, setModalLoading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getAllPost();
      if (response.error) {
        throw new Error(response.error);
      }
      setPosts(response.data);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
      messageApi.error("Failed to fetch posts");
    } finally {
      setLoading(false);
    }
  }, [messageApi]);

  const fetchPostDetails = useCallback(
    async (postId: string) => {
      setModalLoading(true);
      try {
        const response = await getPostById(postId);
        if (response.success) {
          setSelectedPost(response.data);
        } else {
          messageApi.error(response.error || "Failed to fetch post details");
        }
      } catch (error) {
        messageApi.error("An error occurred while fetching the post");
        console.error(error);
      } finally {
        setModalLoading(false);
      }
    },
    [messageApi]
  );

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Handle opening the modal with post details
  const handleViewPostDetail = (postId: string) => {
    setSelectedPostId(postId);
    setIsModalOpen(true);
    fetchPostDetails(postId);
  };

  // Handle closing the modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPostId(null);
    setSelectedPost(null);
  };

  return (
    <>
      {contextHolder}
      <div className="flex justify-center mb-6">
        <Title level={2}>Manage Post System</Title>
      </div>

      <Table
        dataSource={posts}
        columns={getAllPostColumns(fetchPosts, handleViewPostDetail)}
        rowKey="id"
        loading={loading}
        bordered
        scroll={{ x: "max-content" }}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} items`,
        }}
      />

      <ViewPostDetailModal
        open={isModalOpen}
        onClose={handleCloseModal}
        postId={selectedPostId}
        post={selectedPost}
        loading={modalLoading}
        onSuccess={fetchPosts}
      />
    </>
  );
};

export default ManagePost;
