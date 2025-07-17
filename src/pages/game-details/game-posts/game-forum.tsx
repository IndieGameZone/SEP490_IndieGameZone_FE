import { Button, Dropdown, Input, Tag } from "antd";
import { FaSearch } from "react-icons/fa";
import PostCard from "./post-card";
import { MdOutlineSort } from "react-icons/md";
import { useEffect, useState } from "react";
import CreatePostButton from "./create-post-button";
import useTagStore from "@/store/use-tag-store";

const tabs = ["Hot & Trending", "Most popular", "Best", "Latest"];

const items = tabs.map((x) => ({ key: x, label: x }));

const GameForum = () => {
  const { fetchTags } = useTagStore();
  const [selectedSortOption, setSelectedSortOption] = useState(tabs[0]);

  const handleSelect = (e: any) => {
    setSelectedSortOption(e.key);
  };

  useEffect(() => {
    fetchTags();
  }, []);

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
          <CreatePostButton />
        </div>
      </div>

      <div className="col-span-8">
        <PostCard />
      </div>
    </div>
  );
};

export default GameForum;
