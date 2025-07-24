import { GamePost } from "@/types/game-post";
import { Avatar, Button, Dropdown, MenuProps, Modal } from "antd";
import { MouseEvent, useMemo, useState } from "react";
import PostCard from "./post-card";
import { FaChevronLeft, FaChevronRight, FaFlag, FaLink, FaRegComment, FaRegHeart } from "react-icons/fa";
import { IoMdMore } from "react-icons/io";
import { timeAgo } from "@/lib/date-n-time";
import TiptapView from "@/components/tiptap/tiptap-view";
import { IoShareSocialOutline } from "react-icons/io5";

interface PostDetailModalProps {
  post: GamePost | null;
  handleCancel?: (e: MouseEvent) => void;
}
const PostDetailModal = ({ post, handleCancel }: PostDetailModalProps) => {
  const [lightboxIndex, setLightboxIndex] = useState<number>(-1); // for lightbox
  const [currentImage, setCurrentImage] = useState<number>(0); // for slider
  const images: string[] = useMemo(() => {
    return post ? post.postImages.map((image) => image.image) : [];
  }, [post]);

  const slides = useMemo(() => images.map((image) => ({ src: image })), [images]);

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

  if (!post) {
    return;
  }

  return (
    <Modal
      closable
      open={post != null}
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
      <div className="grid grid-cols-2">
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
        <div className="flex flex-col">
          <div className="flex justify-between items-center gap-3 p-3 border-b border-zinc-700 pe-10">
            <div className="flex items-center gap-3">
              <Avatar src={post.user.avatar} />
              <div>
                <div className="font-semibold">{post.user.userName}</div>
                <div className="text-xs text-gray-400">{timeAgo(post.createdAt)}</div>
              </div>
            </div>
            <Dropdown menu={{ items: moreOptionItems }} trigger={["click"]}>
              <Button icon={<IoMdMore />} shape="circle" type="text"></Button>
            </Dropdown>
          </div>
          <div className="p-3 flex-1">
            <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
            <TiptapView value={post.content} />
          </div>

          <div className="flex items-center gap-3 mt-2 border-t border-zinc-700 p-3">
            <Button icon={<FaRegHeart className="text-gray-400" />} shape="round" type="text">
              <span>{post.numberOfLikes}</span>
            </Button>

            <Button icon={<FaRegComment className="text-gray-400 cursor-pointer" />} shape="round" type="text">
              <span>{post.numberOfComments}</span>
            </Button>

            <Button icon={<IoShareSocialOutline className="text-gray-400" />} shape="circle" type="text" />
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default PostDetailModal;
