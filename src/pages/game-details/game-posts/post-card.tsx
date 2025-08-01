import ExpandableWrapper from "@/components/wrappers/expandable-wrapper";
import TiptapView from "@/components/tiptap/tiptap-view";
import { GamePost } from "@/types/game-post";
import { Avatar, Button, Dropdown, MenuProps, Tag } from "antd";
import { useEffect, useMemo, useState } from "react";
import {
  FaChevronLeft,
  FaChevronRight,
  FaFlag,
  FaHeart,
  FaLink,
  FaRegComment,
  FaRegHeart,
  FaTrash,
} from "react-icons/fa";
import { IoMdMore } from "react-icons/io";
import Lightbox from "yet-another-react-lightbox";
import ReportPostModal from "@/components/report-modal/report-post-modal";
import { timeAgo } from "@/lib/date-n-time";
import useGamePostStore from "@/store/use-game-post-store";
import useAuthStore from "@/store/use-auth-store";
import { getPostReactionByPostId, reactPost } from "@/lib/api/game-post-api";
import { useGlobalMessage } from "@/components/message-provider";
import { useCopyCurrentLink } from "@/hooks/use-copy-current-link";

interface PostCardProps {
  post: GamePost;
  onViewPostDetail?: (postId: string) => void;
  onDelete: (postId: string) => void;
}

const PostCard = ({ post, onViewPostDetail, onDelete }: PostCardProps) => {
  const [lightboxIndex, setLightboxIndex] = useState<number>(-1); // for lightbox
  const [currentImage, setCurrentImage] = useState<number>(0); // for slider
  const [reportPostModalOpen, setReportPostModalOpen] = useState(false);
  const [numOfLikes, setNumOfLikes] = useState(post.numberOfLikes);
  const [liked, setLiked] = useState(false);
  const [isSubmittingLike, setIsSubmittingLike] = useState(false);
  const messageApi = useGlobalMessage();
  const { fetchPostComments } = useGamePostStore();
  const { copyLink } = useCopyCurrentLink();
  const { profile } = useAuthStore();

  const images: string[] = useMemo(() => {
    return post.postImages.map((image) => image.image);
  }, [post]);

  const slides = useMemo(
    () => images.map((image) => ({ src: image })),
    [images]
  );

  const moreOptionItems: MenuProps["items"] = useMemo(() => {
    const items: MenuProps["items"] = [
      {
        label: <div>Copy link to post</div>,
        icon: <FaLink />,
        key: "copy",
        onClick: () => {
          if (!post) return;
          copyLink({ postId: post.id });
        },
      },
    ];

    if (profile?.id === post.user.id) {
      items.push({
        label: <div>Delete post</div>,
        key: "delete",
        icon: <FaTrash />,
        onClick: () => {
          onDelete(post.id);
        },
        danger: true,
      });
    } else {
      items.push({
        label: <div>Report post</div>,
        key: "report",
        icon: <FaFlag />,
        onClick: () => setReportPostModalOpen(true),
      });
    }

    return items;
  }, [profile, post]);

  const handlePrev = () => {
    setCurrentImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    (async () => {
      if (!profile || !post) return;
      const result = await getPostReactionByPostId(profile.id, post.id);
      if (!result.error) {
        setLiked(result.data);
      }
    })();
  }, [profile]);

  const handleViewPostDetail = async () => {
    if (onViewPostDetail) {
      await fetchPostComments(post.id);
      onViewPostDetail(post.id);
    }
  };

  const handleReact = async () => {
    if (!profile) {
      messageApi.error("Login to like this post");
      return;
    }
    if (!post) return;
    setIsSubmittingLike(true);
    setLiked((prev) => !prev);
    setNumOfLikes((prev) => {
      if (liked) {
        return prev - 1;
      } else {
        return prev + 1;
      }
    });
    const result = await reactPost(profile.id, post.id);
    setIsSubmittingLike(false);
    if (result.error) {
      messageApi.error("Failed to like post. Please try again!");
      setLiked((prev) => !prev);
      setNumOfLikes((prev) => {
        if (liked) {
          return prev + 1;
        } else {
          return prev - 1;
        }
      });
    }
  };

  return (
    <div>
      <Lightbox
        index={currentImage}
        slides={slides}
        open={lightboxIndex >= 0}
        close={() => setLightboxIndex(-1)}
      />
      <div className="bg-zinc-800 w-full p-3 rounded">
        <div className="flex justify-between items-center gap-3">
          <div className="flex items-center gap-3">
            <Avatar src={post.user.avatar} />
            <div>
              <div className="font-semibold">{post.user.userName}</div>
              <div className="text-xs text-gray-400">
                {timeAgo(post.createdAt)}
              </div>
            </div>
          </div>
          <Dropdown menu={{ items: moreOptionItems }} trigger={["click"]}>
            <Button icon={<IoMdMore />} shape="circle" type="text"></Button>
          </Dropdown>
        </div>

        <div className="mt-2">
          <h4
            className="font-bold text-xl cursor-pointer"
            onClick={handleViewPostDetail}
          >
            {post.title}
          </h4>

          {post.content.trim() && (
            <ExpandableWrapper
              maxHeight={images.length > 0 ? 100 : 500}
              variant="text"
            >
              <TiptapView value={post.content} />
            </ExpandableWrapper>
          )}

          <div className="flex flex-wrap mt-2">
            {post.postTags.map((tag) => {
              return (
                <Tag color="orange" key={tag.tag.id}>
                  {tag.tag.name}
                </Tag>
              );
            })}
          </div>

          {images.length > 0 && (
            <div className="relative">
              {images.length > 1 && (
                <>
                  <button
                    onClick={handlePrev}
                    className="absolute left-2 bottom-1/2 translate-y-1/2 p-3 rounded-full bg-zinc-500/40 cursor-pointer hover:bg-zinc-500/60 duration-300 z-10"
                    aria-label="Previous image button"
                    tabIndex={0}
                  >
                    <FaChevronLeft />
                  </button>
                  <button
                    onClick={handleNext}
                    className="absolute right-2 bottom-1/2 translate-y-1/2 p-3 rounded-full bg-zinc-500/40 cursor-pointer hover:bg-zinc-500/60 duration-300 z-10"
                    aria-label="Next image button"
                    tabIndex={0}
                  >
                    <FaChevronRight />
                  </button>
                </>
              )}
              <img
                className="w-full object-contain aspect-video rounded bg-zinc-900 my-2 cursor-pointer"
                src={images[currentImage]}
                alt={`Post Image ${currentImage + 1}`}
                onClick={() => setLightboxIndex(currentImage)}
              />
            </div>
          )}

          <div className="flex items-center gap-3 mt-2">
            <Button
              icon={
                liked ? (
                  <FaHeart className="fill-rose-600" />
                ) : (
                  <FaRegHeart className="fill-gray-400" />
                )
              }
              shape="round"
              type="text"
              loading={isSubmittingLike}
              onClick={handleReact}
            >
              <span>{numOfLikes}</span>
            </Button>

            <Button
              icon={<FaRegComment className="text-gray-400 cursor-pointer" />}
              shape="round"
              type="text"
              onClick={handleViewPostDetail}
            >
              <span>{post.numberOfComments}</span>
            </Button>

            {/* <Button
              icon={<IoShareSocialOutline className="text-gray-400" />}
              shape="circle"
              type="text"
            /> */}
          </div>
        </div>
      </div>
      <ReportPostModal
        open={reportPostModalOpen}
        onClose={() => setReportPostModalOpen(false)}
        postId={post?.id || ""}
      />
    </div>
  );
};

export default PostCard;
