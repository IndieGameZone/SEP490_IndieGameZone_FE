import { Button, Input, Tag } from "antd";
import { FaSearch } from "react-icons/fa";
import PostCard from "./post-card";
import CreatePost from "./create-post";
import { useState } from "react";
import useGameStore from "@/store/use-game-store";
import useAuthStore from "@/store/use-auth-store";

const GameForum = () => {
  const [isCreateMode, setIsCreateMode] = useState(false);
  const { game } = useGameStore();
  const { profile } = useAuthStore();
  const handleCreatePost = () => {
    setIsCreateMode(true);
  };



  return (
    <div className="px-3">
      {isCreateMode ? (
        <CreatePost
          userId={profile?.id || ""}
          gameId={game?.id || ""}
          onCancel={() => setIsCreateMode(false)}
        />
      ) : (
        <>
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-4">
              <Input
                placeholder="Search Post title or post tags"
                variant="filled"
                style={{
                  width: 300,
                  borderRadius: 10,
                  paddingLeft: 12,
                  paddingRight: 12,
                }}
                suffix={<FaSearch />}
              />
              <div className="flex items-center gap-1">
                <Tag style={{ borderRadius: "9999px", padding: "2px 12px", fontSize: "13px" }}>#Announcement</Tag>
                <Tag style={{ borderRadius: "9999px", padding: "2px 12px", fontSize: "13px" }}>#Bug</Tag>
                <Tag style={{ borderRadius: "9999px", padding: "2px 12px", fontSize: "13px" }}>#Discussion</Tag>
                <Tag style={{ borderRadius: "9999px", padding: "2px 12px", fontSize: "13px" }}>#Question</Tag>
                <Tag style={{ borderRadius: "9999px", padding: "2px 12px", fontSize: "13px" }}>#Guide</Tag>
              </div>
            </div>
            <div>
              <Button type="primary" onClick={handleCreatePost}>
                Create Post
              </Button>
            </div>
          </div>
          <div className="mt-4">
            <PostCard />
          </div>
        </>
      )}
    </div>
  );
};

export default GameForum;