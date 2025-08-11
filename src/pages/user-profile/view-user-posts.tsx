import { useGlobalMessage } from "@/components/message-provider";
import { getDevActivePosts } from "@/lib/api/game-post-api";
import { GamePost } from "@/types/game-post";
import { Empty, Spin } from "antd";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PostCard from "../game-details/game-posts/post-card";
import DeletePostConfirmationModal from "../game-details/game-posts/delete-post-confirmation-modal";

const ViewUserPosts = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<GamePost[]>([]);
  const [loading, setLoading] = useState(false);
  const messageApi = useGlobalMessage();
  const [postToDelete, setPostToDelete] = useState<string | null>(null);

  useEffect(() => {
    fetchUserPosts();
  }, [userId]);

  const fetchUserPosts = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const result = await getDevActivePosts(userId);
      if (result.success) {
        setPosts(result.data);
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="space-y-4 bg-zinc-900 border border-zinc-700 p-3 rounded">
      {posts.length === 0 ? (
        <Empty
          description="This user has posts yet"
          className="p-8 rounded"
        />
      ) : (
        posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            onViewPostDetail={() => handleViewPostDetail(post.id, post.game.id)}
            onDelete={handleDeletePost}
          />
        ))
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
