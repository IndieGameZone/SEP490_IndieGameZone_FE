import MaxWidthWrapper from "@/components/max-width-wrapper";
import { Button, Dropdown } from "antd";
import { useState } from "react";
import { MdOutlineSort } from "react-icons/md";

const tabs = [
  "Most popular",
  "Hot & Trending",
  "Best",
  "Best Seller",
  "Latest",
];

const items = tabs.map((x) => ({ key: x, label: x }));

const SortPanel = () => {
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const handleSelect = (e: any) => {
    setActiveTab(e.key);
  };

  return (
    <MaxWidthWrapper>
      <div className="md:hidden flex justify-end py-2">
        <Dropdown
          menu={{
            items,
            selectable: true,
            defaultSelectedKeys: [activeTab],
            onSelect: handleSelect,
          }}
          trigger={["click"]}
        >
          <Button icon={<MdOutlineSort />} type="text">
            Sort by{" "}
            <span className="font-semibold text-orange-600">'{activeTab}'</span>
          </Button>
        </Dropdown>
      </div>
      <div className="md:flex gap-3 flex-nowrap hidden">
        <div className="flex items-center gap-2">
          <MdOutlineSort />
          <span>sort by</span>
        </div>
        {tabs.map((tab) => (
          <span
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`cursor-pointer transition-all duration-200 border-b-2 p-2 ${
              activeTab === tab
                ? "text-orange-600 border-orange-600"
                : "text-zinc-500 hover:text-gray-200 border-transparent"
            }`}
          >
            {tab}
          </span>
        ))}
      </div>
    </MaxWidthWrapper>
  );
};

export default SortPanel;
