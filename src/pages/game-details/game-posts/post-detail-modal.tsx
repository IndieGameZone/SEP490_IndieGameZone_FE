import { GamePost } from "@/types/game-post";
import { Avatar, Button, Dropdown, MenuProps, Modal } from "antd";
import { MouseEvent, useEffect, useMemo, useState } from "react";
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
import { timeAgo } from "@/lib/date-n-time";
import TiptapView from "@/components/tiptap/tiptap-view";
import { IoShareSocialOutline } from "react-icons/io5";
import Lightbox from "yet-another-react-lightbox";
import PostCommentForm from "./post-comment-form";
import chatEmptyImg from "@/assets/chat-empty.png";
import {
  getGamePostById,
  getPostReactionByPostId,
  reactPost,
} from "@/lib/api/game-post-api";
import { useGlobalMessage } from "@/components/message-provider";
import Loader from "@/components/loader";
import useGamePostStore from "@/store/use-game-post-store";
import useAuthStore from "@/store/use-auth-store";
import ReportCommentModal from "@/components/report-modal/report-comment-modal";
import PostCommentCard from "./post-comment-card";
import { Link } from "react-router-dom";
interface PostDetailModalProps {
  postId: string | null;
  open: boolean;
  handleCancel?: (e: MouseEvent) => void;
  onDelete: (postId: string) => void;
}

const PostDetailModal = ({
  postId,
  open,
  handleCancel,
  onDelete,
}: PostDetailModalProps) => {
  const [lightboxIndex, setLightboxIndex] = useState<number>(-1); // for lightbox
  const [currentImage, setCurrentImage] = useState<number>(0); // for slider
  const [isLoading, setIsLoading] = useState(false);
  const [post, setPost] = useState<GamePost>();
  const messageApi = useGlobalMessage();
  const { postComments, loading: commentsLoading } = useGamePostStore();
  const { profile } = useAuthStore();
  const [reportCommentModalOpen, setReportCommentModalOpen] = useState(false);
  const [selectedCommentId, setSelectedCommentId] = useState<string>("");
  const [numOfLikes, setNumOfLikes] = useState(0);
  const [isSubmittingLike, setIsSubmittingLike] = useState(false);
  const [liked, setLiked] = useState(false);

  const fetchPost = async () => {
    if (!postId) return;
    setIsLoading(true);
    try {
      const result = await getGamePostById(postId);
      setIsLoading(false);
      if (result.error) {
        messageApi.error("Failed to fetch post! Please try again later.");
        return;
      }
      setPost(result.data);
      setNumOfLikes(result.data.numberOfLikes ?? 0);
    } catch (error) {
      messageApi.error("An error occurred while fetching data!");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPost();
  }, [postId]);

  useEffect(() => {
    (async () => {
      if (!profile || !postId) return;
      const result = await getPostReactionByPostId(profile.id, postId);
      if (!result.error) {
        setLiked(result.data);
      }
    })();
  }, [profile]);

  const handleReportComment = (commentId: string) => {
    setSelectedCommentId(commentId);
    setReportCommentModalOpen(true);
  };
  const images: string[] = useMemo(() => {
    return post?.postImages ? post.postImages.map((image) => image.image) : [];
  }, [post]);

  const slides = useMemo(
    () => images.map((image) => ({ src: image })),
    [images]
  );

  const handlePrev = () => {
    setCurrentImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const moreOptionItems: MenuProps["items"] = useMemo(() => {
    const items: MenuProps["items"] = [
      {
        label: <div>Copy link to post</div>,
        icon: <FaLink />,
        key: "copy",
      },
    ];

    if (profile?.id === post?.user.id) {
      items.push({
        label: <div>Delete post</div>,
        key: "delete",
        icon: <FaTrash />,
        onClick: () => {
          if (post) {
            onDelete(post.id);
          }
        },
        danger: true,
      });
    } else {
      items.push({
        label: <div>Report post</div>,
        key: "report",
        icon: <FaFlag />,
      });
    }

    return items;
  }, [profile, post]);

  const onSubmitComment = () => {
    fetchPost();
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

  if (!postId) {
    return;
  }

  return (
    <>
      <Modal
        closable
        open={open}
        onCancel={handleCancel}
        footer={null}
        width={{
          xs: "90%",
          sm: "80%",
          md: "70%",
          lg: "70%",
          xl: "70%",
          xxl: "70%",
        }}
        styles={{ content: { padding: "0" } }}
      >
        <Lightbox
          index={currentImage}
          slides={slides}
          open={lightboxIndex >= 0}
          close={() => setLightboxIndex(-1)}
        />
        <div className="grid grid-cols-2">
          <div>
            <div className="p-3 max-h-[80vh] overflow-auto pb-10">
              {!isLoading ? (
                <>
                  <h3 className="text-xl font-semibold mb-2">{post?.title}</h3>
                  <TiptapView value={post?.content} />
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
                        className="w-full object-contain rounded bg-zinc-900 my-2 cursor-pointer"
                        src={images[currentImage]}
                        alt={`Post Image ${currentImage + 1}`}
                        onClick={() => setLightboxIndex(currentImage)}
                      />
                    </div>
                  )}
                </>
              ) : (
                <div className="flex items-center justify-center py-32">
                  <Loader type="inline" />
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-col border-l border-zinc-700">
            <div className="p-3 border-b border-zinc-700 pe-10">
              <div className="flex items-center gap-3">
                <Link className="mt-1" to={`/profile/${post?.user.id}`}>
                  <Avatar src={post?.user.avatar} />
                </Link>
                <div>
                  <Link className="mt-1" to={`/profile/${post?.user.id}`}>
                    <div className="font-semibold">{post?.user.userName}</div>
                  </Link>
                  <div className="text-xs text-gray-400">
                    {post?.createdAt && timeAgo(post.createdAt)}
                  </div>
                </div>
              </div>
            </div>

            {commentsLoading ? (
              <div className="flex-1 flex justify-center items-center">
                <Loader type="inline" />
              </div>
            ) : postComments.length === 0 ? (
              <div className="flex-1 flex justify-center items-center flex-col">
                <img src={chatEmptyImg} alt="" className="w-40 opacity-50" />
                <p className="text-zinc-500">This post has no comments yet.</p>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto">
                {postComments.map((comment) => (
                  <PostCommentCard
                    comment={comment}
                    key={comment.id}
                    onReportComment={handleReportComment}
                  />
                ))}
              </div>
            )}
            <PostCommentForm
              onSubmit={onSubmitComment}
              postId={post?.id ?? null}
            />
            <div className="flex justify-between mt-2 border-t border-zinc-700 p-3">
              <div className="flex items-center gap-3 ">
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
                  icon={
                    <FaRegComment className="text-gray-400 cursor-pointer" />
                  }
                  shape="round"
                  type="text"
                >
                  <span>{post?.numberOfComments}</span>
                </Button>

                <Button
                  icon={<IoShareSocialOutline className="text-gray-400" />}
                  shape="circle"
                  type="text"
                />
              </div>
              <Dropdown menu={{ items: moreOptionItems }} trigger={["click"]}>
                <Button icon={<IoMdMore />} shape="circle" type="text"></Button>
              </Dropdown>
            </div>
          </div>
        </div>
      </Modal>
      <ReportCommentModal
        open={reportCommentModalOpen}
        onClose={() => {
          setReportCommentModalOpen(false);
          setSelectedCommentId("");
        }}
        commentId={selectedCommentId}
      />
    </>
  );
};

export default PostDetailModal;
