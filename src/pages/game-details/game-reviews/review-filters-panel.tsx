import { Radio, RadioChangeEvent } from "antd";
const filterOptions = [
  { value: "all", label: "All Ratings" },
  { value: "5", label: "5 Stars" },
  { value: "4", label: "4 Stars" },
  { value: "3", label: "3 Stars" },
  { value: "2", label: "2 Stars" },
  { value: "1", label: "1 Star" },
];

type Filters = {
  page: number;
  rating: number | undefined;
};

interface ReviewFiltersPanelProps {
  selectedRating: number | undefined;
  setFilters: (updates: Partial<Filters>) => void;
}

const ReviewFiltersPanel = ({ selectedRating, setFilters }: ReviewFiltersPanelProps) => {
  const handleChange = (e: RadioChangeEvent) => {
    const value = e.target.value;
    if (value == "all") {
      setFilters({
        rating: undefined,
        page: 1,
      });
    } else {
      setFilters({
        rating: value,
        page: 1,
      });
    }
  };

  return (
    <div className="p-3 bg-zinc-800 rounded md:block hidden">
      <p className="text-sm text-zinc-500 mb-1">Star ratings</p>
      <Radio.Group
        block
        options={filterOptions}
        defaultValue="all"
        optionType="button"
        buttonStyle="solid"
        value={selectedRating}
        onChange={handleChange}
      />
    </div>
  );
};
export default ReviewFiltersPanel;
