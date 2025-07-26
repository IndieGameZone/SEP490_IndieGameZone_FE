import { GamePost } from "@/types/game-post";
import { Avatar, Button, Dropdown, MenuProps, Modal } from "antd";
import { MouseEvent, useEffect, useMemo, useState } from "react";
import {
  FaChevronLeft,
  FaChevronRight,
  FaFlag,
  FaLink,
  FaRegComment,
  FaRegHeart,
} from "react-icons/fa";
import { IoMdMore } from "react-icons/io";
import { timeAgo } from "@/lib/date-n-time";
import TiptapView from "@/components/tiptap/tiptap-view";
import { IoShareSocialOutline } from "react-icons/io5";
import Lightbox from "yet-another-react-lightbox";
import PostCommentForm from "./post-comment-form";
import chatEmptyImg from "@/assets/chat-empty.png";
import { getGamePostById } from "@/lib/api/game-post-api";
import { useGlobalMessage } from "@/components/message-provider";
import Loader from "@/components/loader";

interface PostDetailModalProps {
  postId: string | null;
  handleCancel?: (e: MouseEvent) => void;
}

const postComments = [];
const PostDetailModal = ({ postId, handleCancel }: PostDetailModalProps) => {
  const [lightboxIndex, setLightboxIndex] = useState<number>(-1); // for lightbox
  const [currentImage, setCurrentImage] = useState<number>(0); // for slider
  const [post, setPost] = useState<GamePost>();
  const messageApi = useGlobalMessage();

  const fetchPost = async () => {
    if (!postId) return;
    const result = await getGamePostById(postId);
    if (result.error) {
      messageApi.error("Failed to fetch post! Please try again later.");
    } else {
      setPost(result.data);
    }
  };

  useEffect(() => {
    fetchPost();
  }, [postId]);

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

  const moreOptionItems: MenuProps["items"] = [
    {
      label: <div>Copy link to post</div>,
      icon: <FaLink />,
      key: "0",
    },
    {
      label: <div>Report post</div>,
      key: "1",
      icon: <FaFlag />,
    },
  ];

  if (!postId) {
    return;
  }

  return (
    <Modal
      closable
      open={postId != null}
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
            {post ? (
              <>
                <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
                <TiptapView value={post.content} />
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
              <Loader />
            )}
          </div>
        </div>
        <div className="flex flex-col border-l border-zinc-700">
          <div className="p-3 border-b border-zinc-700 pe-10">
            <div className="flex items-center gap-3">
              <Avatar src={post?.user.avatar} />
              <div>
                <div className="font-semibold">{post?.user.userName}</div>
                <div className="text-xs text-gray-400">
                  {post?.createdAt && timeAgo(post.createdAt)}
                </div>
              </div>
            </div>
          </div>
          {postComments.length == 0 ? (
            <div className="flex-1 flex justify-center items-center flex-col">
              <img src={chatEmptyImg} alt="" className="w-40 opacity-50" />
              <p className="text-zinc-500">This post has not comment yet.</p>
            </div>
          ) : (
            <div></div>
          )}
          <PostCommentForm />
          <div className="flex justify-between mt-2 border-t border-zinc-700 p-3">
            <div className="flex items-center gap-3 ">
              <Button
                icon={<FaRegHeart className="text-gray-400" />}
                shape="round"
                type="text"
              >
                <span>{post?.numberOfLikes}</span>
              </Button>

              <Button
                icon={<FaRegComment className="text-gray-400 cursor-pointer" />}
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
  );
};

export default PostDetailModal;
