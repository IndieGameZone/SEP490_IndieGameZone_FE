import { Input, Tag } from "antd";
import { FaSearch } from "react-icons/fa";
import PostCard from "./post-card";

const GameForum = () => {
  return (
    <div className="grid grid-cols-12 gap-3">
      <div className="col-span-4">
        <div className="">
          <Input
            placeholder="Search Post title or post tags"
            variant="filled"
            suffix={<FaSearch />}
          />
          <div className="flex flex-wrap gap-2 mt-3">
            <Tag>#Announcement</Tag>
            <Tag>#Bug</Tag>
            <Tag>#Discussion</Tag>
            <Tag>#Question</Tag>
            <Tag>#Guide</Tag>
          </div>
        </div>
      </div>
      <div className="col-span-8">
        <PostCard />
      </div>
    </div>
  );
};

export default GameForum;
