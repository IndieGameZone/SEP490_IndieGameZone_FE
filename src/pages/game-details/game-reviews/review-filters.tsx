import { Radio } from "antd";
const filterOptions = [
  { value: "all", label: "All Ratings" },
  { value: "5", label: "5 Stars" },
  { value: "4", label: "4 Stars" },
  { value: "3", label: "3 Stars" },
  { value: "2", label: "2 Stars" },
  { value: "1", label: "1 Star" },
];

const ReviewFilters = () => (
  <div className="p-3 bg-zinc-800 rounded">
    <p className="text-sm text-zinc-500 mb-1">Star ratings</p>
    <Radio.Group
      block
      options={filterOptions}
      defaultValue="all"
      optionType="button"
      buttonStyle="solid"
    />
  </div>
);
export default ReviewFilters;
