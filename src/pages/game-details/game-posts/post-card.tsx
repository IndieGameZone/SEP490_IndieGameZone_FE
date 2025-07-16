import { Avatar, Button, Dropdown, MenuProps, Tag } from "antd";
import { useState } from "react";
import {
  FaChevronLeft,
  FaChevronRight,
  FaFlag,
  FaLink,
  FaRegComment,
  FaRegHeart,
} from "react-icons/fa";
import { IoMdMore } from "react-icons/io";
import { IoShareSocialOutline } from "react-icons/io5";
import Lightbox from "yet-another-react-lightbox";

const PostCard = () => {
  const IMAGES = [
    "https://placehold.co/600x400?text=Image+1",
    "https://placehold.co/600x400?text=Image+2",
    "https://placehold.co/600x400?text=Image+3",
  ];

  const [index, setIndex] = useState(-1); // for lightbox
  const [currentImage, setCurrentImage] = useState(0); // for slider

  const slides = IMAGES.map((image) => ({
    src: image,
  }));

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

  const handlePrev = () => {
    setCurrentImage((prev) => (prev === 0 ? IMAGES.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentImage((prev) => (prev === IMAGES.length - 1 ? 0 : prev + 1));
  };

  return (
    <div>
      <Lightbox
        index={currentImage}
        slides={slides}
        open={index >= 0}
        close={() => setIndex(-1)}
      />
      <div className="bg-zinc-800 w-full p-3">
        <div className="flex justify-between items-center gap-3">
          <div className="flex items-center gap-3">
            <Avatar src="https://cdn.lazi.vn/storage/uploads/users/avatar/1693142947_lazi_435254.jpg" />
            <div>
              <div className="font-semibold">Lorem ipsum</div>
              <div className="text-xs text-gray-400">2 days ago</div>
            </div>
          </div>
          <Dropdown menu={{ items: moreOptionItems }}>
            <Button icon={<IoMdMore />} shape="circle" type="text"></Button>
          </Dropdown>
        </div>

        <div className="mt-2">
          <div className="flex flex-col gap-3">
            <span className="font-bold text-xl">
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Aliquid
              sed id veniam rerum possimus voluptas, modi qui dolor aspernatur.
            </span>
          </div>

          <div className="flex flex-wrap mt-2">
            <Tag color="orange">#Announcement</Tag>
            <Tag color="orange">#Bug</Tag>
            <Tag color="orange">#Solution</Tag>
          </div>

          <div className="relative">
            <button
              onClick={handlePrev}
              className="absolute left-2 bottom-1/2 translate-y-1/2 p-3 rounded-full bg-zinc-500/40 cursor-pointer hover:bg-zinc-500/60 duration-300 z-10"
            >
              <FaChevronLeft />
            </button>
            <img
              className="w-full object-contain aspect-video rounded bg-zinc-900 my-2 cursor-pointer"
              src={IMAGES[currentImage]}
              alt={`Post Image ${currentImage + 1}`}
              onClick={() => setIndex(currentImage)}
            />
            <button
              onClick={handleNext}
              className="absolute right-2 bottom-1/2 translate-y-1/2 p-3 rounded-full bg-zinc-500/40 cursor-pointer hover:bg-zinc-500/60 duration-300 z-10"
            >
              <FaChevronRight />
            </button>
          </div>

          <div className="flex items-center gap-3 mt-2">
            <Button
              icon={<FaRegHeart className="text-gray-400" />}
              shape="round"
              type="text"
            >
              <span>1000</span>
            </Button>

            <Button
              icon={<FaRegComment className="text-gray-400" />}
              shape="round"
              type="text"
            >
              <span>1000</span>
            </Button>

            <Button
              icon={<IoShareSocialOutline className="text-gray-400" />}
              shape="circle"
              type="text"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
