import { Button, Dropdown, Input, Tag, message } from "antd";
import { FaSearch } from "react-icons/fa";
import PostCard from "./post-card";
import { MdOutlineSort } from "react-icons/md";
import { useEffect, useState } from "react";
import CreatePostButton from "./create-post-button";
import useTagStore from "@/store/use-tag-store";
import { useParams } from "react-router-dom";
import { getGamePosts } from "@/lib/api/game-post-api";
import { useRerender } from "@/hooks/use-rerender";
import { GamePost } from "@/types/game-post";
import InfiniteScroll from "react-infinite-scroll-component";
import { LuRefreshCcw } from "react-icons/lu";
import notFoundIcon from "@/assets/not-found-icon.svg";
import PostDetailModal from "./post-detail-modal";

const tabs = ["Hot & Trending", "Most popular", "Best", "Latest"];

const items = tabs.map((x) => ({ key: x, label: x }));

const PAGE_SIZE = 2;

const GameForum = () => {
  const { fetchTags } = useTagStore();
  const [selectedSortOption, setSelectedSortOption] = useState(tabs[0]);
  const [messageApi, contextHolder] = message.useMessage();
  const [posts, setPosts] = useState<GamePost[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const { gameId } = useParams();
  const { renderKey } = useRerender();
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [selectedPost, setSelectedPost] = useState<GamePost | null>(null);

  const handleSelect = (e: any) => {
    setSelectedSortOption(e.key);
  };

  const fetchPosts = async (currentPage: number) => {
    if (gameId) {
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
        const pagination = paginationHeader
          ? JSON.parse(paginationHeader)
          : null;
        if (currentPage == 1) {
          setPosts(newPosts);
        } else {
          setPosts((prev) => [...prev, ...newPosts]);
        }
        setHasMore(pagination?.HasNext ?? false);
        setPage(currentPage + 1);
      }
      setIsFetching(false);
    }
  };

  const fetchMore = () => {
    fetchPosts(page);
  };

  const handleCancel = () => {
    setSelectedPost(null);
  };

  useEffect(() => {
    fetchTags();
  }, []);

  useEffect(() => {
    fetchPosts(1);
  }, [gameId, renderKey]);

  return (
    <div className="grid grid-cols-12 gap-3">
      {contextHolder}
      <PostDetailModal post={selectedPost} handleCancel={handleCancel}/>
      <div className="col-span-4">
        <div className="bg-zinc-800 p-3 rounded">
          <Dropdown
            menu={{
              items,
              selectable: true,
              defaultSelectedKeys: [selectedSortOption],
              onSelect: handleSelect,
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
            <Tag color="orange">#Announcement</Tag>
            <Tag color="orange">#Bug</Tag>
            <Tag color="orange">#Discussion</Tag>
            <Tag color="orange">#Question</Tag>
            <Tag color="orange">#Guide</Tag>
          </div>
          <hr className="border border-zinc-700 my-3" />
          <CreatePostButton />
        </div>
      </div>
      <div className="col-span-8">
        <InfiniteScroll
          dataLength={posts.length}
          next={fetchMore}
          hasMore={hasMore}
          loader={
            <div className="col-span-full flex justify-center py-10">
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
            {posts.map((post, index: number) => {
              return (
                <PostCard
                  key={`post-${index}`}
                  post={post}
                  onViewPostDetail={setSelectedPost}
                />
              );
            })}

            {!isFetching && posts.length === 0 && (
              <div className="col-span-full flex flex-col items-center py-10 gap-5">
                <img src={notFoundIcon} />
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
