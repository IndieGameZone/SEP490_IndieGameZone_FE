import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Button, Dropdown, Input, Tag, message } from "antd";
import { FaSearch } from "react-icons/fa";
import { MdOutlineSort } from "react-icons/md";
import { LuRefreshCcw } from "react-icons/lu";
import InfiniteScroll from "react-infinite-scroll-component";

import PostCard from "./post-card";
import CreatePostButton from "./create-post-button";
import PostDetailModal from "./post-detail-modal";
import DeletePostConfirmationModal from "./delete-post-confirmation-modal";

import useTagStore from "@/store/use-tag-store";
import { useRerender } from "@/hooks/use-rerender";
import { getGamePosts } from "@/lib/api/game-post-api";
import { GamePost } from "@/types/game-post";
import notFoundIcon from "@/assets/not-found-icon.svg";
import usePostStore from "@/store/use-game-post-store";
import { usePostDetail } from "@/hooks/use-post-detail";
import useAuthStore from "@/store/use-auth-store";

const SORT_TABS = ["Hot & Trending", "Most popular", "Best", "Latest"];
const PAGE_SIZE = 4;

const sortMenuItems = SORT_TABS.map((tab) => ({ key: tab, label: tab }));

const GameForum = () => {
  const { fetchTags } = useTagStore();
  const { gameId } = useParams();
  const { renderKey, rerender } = useRerender();

  const { postDetailOpen, selectedPostId, openPostDetail, closePostDetail } =
    usePostDetail();

  const [selectedSortOption, setSelectedSortOption] = useState(SORT_TABS[0]);
  const [messageApi, contextHolder] = message.useMessage();

  const { posts, setPosts } = usePostStore();
  const { profile } = useAuthStore();

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const postToDelete = useRef<string | null>(null);

  const handleSortSelect = ({ key }: { key: string }) => {
    setSelectedSortOption(key);
  };

  const handleSetPostToDelete = (postId: string) => {
    postToDelete.current = postId;
    setDeleteConfirmOpen(true);
  };

  const handleCancelDelete = () => {
    postToDelete.current = null;
    setDeleteConfirmOpen(false);
  };

  const handleDeleteFinish = () => {
    postToDelete.current = null;
    setDeleteConfirmOpen(false);
  };

  const fetchPosts = async (currentPage: number) => {
    if (!gameId) return;

    setIsFetching(true);

    const result = await getGamePosts(gameId, {
      PageNumber: currentPage,
      PageSize: PAGE_SIZE,
    });

    if (result.error) {
      messageApi.error("Failed to get posts! Please try again.");
    } else {
      const newPosts: GamePost[] = result.data.posts;
      const paginationHeader = result.data.headers["x-pagination"];
      const pagination = paginationHeader ? JSON.parse(paginationHeader) : null;

      setPosts(currentPage === 1 ? newPosts : [...posts, ...newPosts]);
      setHasMore(pagination?.HasNext ?? false);
      setPage(currentPage + 1);
    }

    setIsFetching(false);
  };

  const fetchMorePosts = () => fetchPosts(page);

  useEffect(() => {
    fetchTags();
  }, []);

  useEffect(() => {
    fetchPosts(1);
  }, [gameId, renderKey]);

  return (
    <div className="flex flex-col md:grid md:grid-cols-12 gap-3">
      {contextHolder}

      <PostDetailModal
        open={postDetailOpen}
        postId={selectedPostId}
        handleCancel={closePostDetail}
        onDelete={handleSetPostToDelete}
      />

      <DeletePostConfirmationModal
        postId={postToDelete.current}
        onCancel={handleCancelDelete}
        onDeleteFinish={handleDeleteFinish}
        open={deleteConfirmOpen}
      />

      {/* Left Panel */}
      <div className="col-span-4">
        <div className="bg-zinc-800 p-3 rounded">
          <Dropdown
            menu={{
              items: sortMenuItems,
              selectable: true,
              defaultSelectedKeys: [selectedSortOption],
              onSelect: handleSortSelect,
            }}
            trigger={["click"]}
          >
            <Button icon={<MdOutlineSort />} type="text">
              Sort by{" "}
              <span className="font-semibold text-orange-600">
                '{selectedSortOption}'
              </span>
            </Button>
          </Dropdown>

          <Input
            className="mt-2"
            placeholder="Search Post title or post tags"
            variant="filled"
            suffix={<FaSearch />}
          />

          <div className="flex flex-wrap gap-2 mt-3">
            {[
              "#Announcement",
              "#Bug",
              "#Discussion",
              "#Question",
              "#Guide",
            ].map((tag) => (
              <Tag key={tag} color="orange">
                {tag}
              </Tag>
            ))}
          </div>

          <hr className="border border-zinc-700 my-3" />
          {profile && <CreatePostButton rerender={rerender} />}
        </div>
      </div>

      {/* Right Panel */}
      <div className="col-span-8">
        <InfiniteScroll
          dataLength={posts.length}
          next={fetchMorePosts}
          hasMore={hasMore}
          loader={
            <div className="flex justify-center py-10">
              <LuRefreshCcw className="animate-spin-reverse size-16" />
            </div>
          }
          endMessage={
            <p className="text-center my-4 text-sm text-zinc-500">
              No more posts
            </p>
          }
        >
          <div className="space-y-3">
            {posts.map((post, index) => (
              <PostCard
                key={`post-${index}`}
                post={post}
                onViewPostDetail={openPostDetail}
                onDelete={handleSetPostToDelete}
              />
            ))}

            {!isFetching && posts.length === 0 && (
              <div className="flex flex-col items-center py-10 gap-5">
                <img src={notFoundIcon} alt="No posts found" />
                <div className="text-zinc-500 font-semibold text-lg">
                  No posts found
                </div>
              </div>
            )}
          </div>
        </InfiniteScroll>
      </div>
    </div>
  );
};

export default GameForum;
