import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Input, message } from "antd";
import { FaSearch } from "react-icons/fa";
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
import { useFilters } from "@/hooks/use-filters";

// const SORT_TABS = ["Hot & Trending", "Most popular", "Best", "Latest"];
const PAGE_SIZE = 4;

// const sortMenuItems = SORT_TABS.map((tab) => ({ key: tab, label: tab }));

type PostFilters = {
  tags: string[];
};

const GameForum = () => {
  const { fetchPostTags, postTags } = useTagStore();
  const { gameId } = useParams();
  const { renderKey, rerender } = useRerender();

  const { postDetailOpen, selectedPostId, openPostDetail, closePostDetail } =
    usePostDetail();

  // const [selectedSortOption, setSelectedSortOption] = useState(SORT_TABS[0]);
  const [messageApi, contextHolder] = message.useMessage();

  const { posts, setPosts } = usePostStore();
  const { profile } = useAuthStore();

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const postToDelete = useRef<string | null>(null);

  const { filters, setFilter } = useFilters<PostFilters>(
    {
      tags: [],
    },
    {
      keepHash: true,
    }
  );

  // const handleSortSelect = ({ key }: { key: string }) => {
  //   setSelectedSortOption(key);
  // };

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
      Tags: filters.tags,
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
    fetchPostTags();
  }, []);

  useEffect(() => {
    fetchPosts(1);
  }, [gameId, renderKey, JSON.stringify(filters.tags)]);

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
          {/* <Dropdown
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
          </Dropdown> */}

          <Input
            className="mt-2"
            placeholder="Search Post title or post tags"
            variant="filled"
            suffix={<FaSearch />}
          />
          <div className="flex flex-col gap-2 mt-3">
            <button
              className={`px-5 py-2 ${
                filters.tags == undefined || filters.tags.length == 0
                  ? "bg-orange-500"
                  : "bg-zinc-900"
              } font-semibold cursor-pointer highlight-hover text-left`}
              onClick={() => setFilter("tags", [])}
            >
              All Posts
            </button>
            {postTags.map((tag) => {
              return (
                <button
                  className={`px-5 py-2 ${
                    filters.tags.includes(tag.id)
                      ? "bg-orange-500"
                      : "bg-zinc-900"
                  } font-semibold cursor-pointer highlight-hover text-left`}
                  key={tag.id}
                  onClick={() => setFilter("tags", [tag.id])}
                >
                  {tag.name}
                </button>
              );
            })}
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
                setFilter={setFilter}
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
