import { Button, Dropdown, Input, Tag } from "antd";
import { FaPlus, FaSearch } from "react-icons/fa";
import PostCard from "./post-card";
import { MdOutlineSort } from "react-icons/md";
import { useState } from "react";

const tabs = ["Hot & Trending", "Most popular", "Best", "Latest"];

const items = tabs.map((x) => ({ key: x, label: x }));

const GameForum = () => {
  const [selectedSortOption, setSelectedSortOption] = useState(tabs[0]);
  const handleSelect = (e: any) => {
    setSelectedSortOption(e.key);
  };
  return (
    <div className="grid grid-cols-12 gap-3">
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
          <Button
            type="primary"
            style={{ paddingInline: "2rem" }}
            icon={<FaPlus />}
          >
            Create Post
          </Button>
        </div>
      </div>

      <div className="col-span-8">
        <PostCard />
      </div>
    </div>
  );
};

export default GameForum;
