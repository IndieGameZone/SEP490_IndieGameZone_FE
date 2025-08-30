import { useGlobalMessage } from "@/components/message-provider";
import { getPostByUserId } from "@/lib/api/game-post-api";
import { GamePost } from "@/types/game-post";
import { Alert, Empty, Spin, Tag, Tooltip } from "antd";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PostCard from "../game-details/game-posts/post-card";
import DeletePostConfirmationModal from "../game-details/game-posts/delete-post-confirmation-modal";
import useAuthStore from "@/store/use-auth-store";
import { InfoCircleOutlined } from "@ant-design/icons";
import Loader from "@/components/loader";

const ViewUserPosts = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<GamePost[]>([]);
  const [loading, setLoading] = useState(false);
  const messageApi = useGlobalMessage();
  const [postToDelete, setPostToDelete] = useState<string | null>(null);
  const { profile } = useAuthStore();
  const [username, setUsername] = useState<string>("this user");

  const isProfileOwner = profile?.id === userId;

  useEffect(() => {
    fetchUserPosts();
  }, [userId, isProfileOwner]);

  const fetchUserPosts = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const result = await getPostByUserId(userId);
      if (result.success) {
        if (isProfileOwner) {
          setPosts(result.data);
        } else {
          const approvedPosts = result.data.filter((post: GamePost) => post.status?.toLowerCase() === "approved");
          setPosts(approvedPosts);

          if (result.data.length > 0 && result.data[0].user && result.data[0].user.userName) {
            setUsername(result.data[0].user.userName);
          }
        }
      } else {
        messageApi.error(result.error || "Failed to load posts");
      }
    } catch (error) {
      messageApi.error("Failed to load posts. Please try again!");
    } finally {
      setLoading(false);
    }
  };

  const handleViewPostDetail = (postId: string, gameId: string) => {
    navigate(`/game/${gameId}?postId=${postId}#forum`);
  };

  const handleDeletePost = (postId: string) => {
    setPostToDelete(postId);
  };

  const handleDeleteFinish = () => {
    setPostToDelete(null);
    fetchUserPosts();
  };

  const getStatusBadge = (status: string) => {
    let color = "default";
    let text = status;

    switch (status.toLowerCase()) {
      case "approved":
        color = "success";
        text = "Approved";
        break;
      case "pendingaireview":
        color = "processing";
        text = "Pending AI Review";
        break;
      case "pendingmanualreview":
        color = "warning";
        text = "Pending Manual Review";
        break;
      case "rejected":
        color = "error";
        text = "Rejected";
        break;
      default:
        color = "default";
        text = status;
    }

    return { color, text };
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <Loader />
      </div>
    );
  }

  return (
    <div className="space-y-4 bg-zinc-900 border border-zinc-700 p-3 rounded">
      <div className="">
        {!isProfileOwner && (
          <Alert
            message={
              <div className="flex items-center">
                <InfoCircleOutlined className="mr-2" />
                <span>You're viewing only the approved posts from {username}</span>
              </div>
            }
            type="success"
            showIcon={false}
            className="mb-4"
          />
        )}
      </div>
      {posts.length === 0 ? (
        <Empty
          description={isProfileOwner ? "You haven't created any posts yet" : `${username} has no approved posts yet`}
          className="p-8 rounded"
        />
      ) : (
        <>
          <div>
            {isProfileOwner && (
              <Alert
                message={
                  <div>
                    <span className="text-lg font-semibold">My Posts </span>
                    <div className="flex items-center gap-2">
                      <InfoCircleOutlined />
                      <span>You can read all your Posts including all Post statuses</span>
                    </div>
                  </div>
                }
                type="info"
                showIcon={false}
                className="mb-4"
              />
            )}
          </div>
          {posts.map((post) => {
            const isApproved = post.status?.toLowerCase() === "approved";
            const gameName = post.game?.name || "Unknown Game";
            const tooltipTitle = `Post in game: ${gameName}`;
            return (
              <Tooltip
                key={post.id}
                title={tooltipTitle}
                placement="topRight"
                mouseEnterDelay={0.3}
              >
                <div className={`relative ${!isApproved ? "opacity-70 transition-opacity" : ""} cursor-pointer`}>
                  {!isApproved && post.status && (
                    <div className="absolute top-5 right-8 z-10">
                      <Tag color={getStatusBadge(post.status).color} className="px-2 py-1 font-medium">
                        {getStatusBadge(post.status).text}
                      </Tag>
                    </div>
                  )}

                  <PostCard
                    post={post}
                    onViewPostDetail={() => handleViewPostDetail(post.id, post.game.id)}
                    onDelete={isProfileOwner ? handleDeletePost : undefined}
                  />
                </div>
              </Tooltip>
            );
          })}
        </>
      )}

      <DeletePostConfirmationModal
        open={!!postToDelete}
        postId={postToDelete}
        onCancel={() => setPostToDelete(null)}
        onDeleteFinish={handleDeleteFinish}
      />
    </div>
  );
};

export default ViewUserPosts;
