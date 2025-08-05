import MaxWidthWrapper from "@/components/wrappers/max-width-wrapper";
import { Button, Dropdown } from "antd";
import { useEffect, useMemo, useState } from "react";
import { MdOutlineSort } from "react-icons/md";
import { useSearchParams } from "react-router-dom";

const tabs = [
  {
    label: "Newest",
    sortBy: "CreatedAt",
    sortDescending: true,
  },
  {
    label: "Oldest",
    sortBy: "CreatedAt",
    sortDescending: false,
  },
  {
    label: "Most Downloaded",
    sortBy: "NumberOfDownloads",
    sortDescending: true,
  },
  {
    label: "Least Downloaded",
    sortBy: "NumberOfDownloads",
    sortDescending: false,
  },
  {
    label: "Highest Price",
    sortBy: "Price",
    sortDescending: true,
  },
  {
    label: "Lowest Price",
    sortBy: "Price",
    sortDescending: false,
  },
];

const SortPanel = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const sortByParam = searchParams.get("sortBy");
  const sortDescParam = searchParams.get("sortDesc");

  const defaultTab = useMemo(() => {
    return (
      tabs.find(
        (tab) =>
          tab.sortBy === sortByParam &&
          String(tab.sortDescending) === sortDescParam
      ) || tabs[0]
    );
  }, [sortByParam, sortDescParam]);

  const [activeTab, setActiveTab] = useState(defaultTab);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sortBy", activeTab.sortBy);
    params.set("sortDesc", String(activeTab.sortDescending));
    setSearchParams(params);
  }, [activeTab]);

  const handleSelect = (e: any) => {
    const selected = tabs.find((tab) => tab.label === e.key);
    if (selected) setActiveTab(selected);
  };

  const items = tabs.map((x) => ({ key: x.label, label: x.label }));

  return (
    <MaxWidthWrapper>
      <div className="md:hidden flex justify-end py-2">
        <Dropdown
          menu={{
            items,
            selectable: true,
            defaultSelectedKeys: [activeTab.label],
            onSelect: handleSelect,
          }}
          trigger={["click"]}
        >
          <Button icon={<MdOutlineSort />} type="text">
            Sort by{" "}
            <span className="font-semibold text-orange-600">'{activeTab.label}'</span>
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
            key={tab.label}
            onClick={() => setActiveTab(tab)}
            className={`cursor-pointer transition-all duration-200 border-b-2 p-2 ${
              activeTab.label === tab.label
                ? "text-orange-600 border-orange-600"
                : "text-zinc-500 hover:text-gray-200 border-transparent"
            }`}
          >
            {tab.label}
          </span>
        ))}
      </div>
    </MaxWidthWrapper>
  );
};

export default SortPanel;
