import { Pagination, Radio, Select } from "antd";
import ReviewGameForm from "./review-game-form";
import useGameStore from "@/store/use-game-store";
import RatingChart from "./rating-chart";
import useAuthStore from "@/store/use-auth-store";
import ReviewCard from "./review-card";

const filterOptions = [
  {
    value: "all",
    label: "All Ratings",
  },
  {
    value: "5",
    label: "5 Stars",
  },
  {
    value: "4",
    label: "4 Stars",
  },
  {
    value: "3",
    label: "3 Stars",
  },
  {
    value: "2",
    label: "2 Stars",
  },
  {
    value: "1",
    label: "1 Star",
  },
];

const sortOptions = [
  {
    value: "most-helpful",
    label: "Most helpful",
  },
  {
    value: "latest",
    label: "Latest",
  },
];

const GameReviews = () => {
  const { game } = useGameStore();
  const { profile } = useAuthStore();
  return (
    <div className="p-3">
      {profile && <ReviewGameForm />}
      <div className="py-3">
        <div>
          <h3 className="text-xl font-semibold">
            Players reviews for {game?.name}
          </h3>
          <hr className="my-1 border-zinc-600" />
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
          <div className="grid grid-cols-12 mt-3 gap-3">
            <div className="col-span-4">
              <RatingChart />
            </div>
            <div className="col-span-8">
              <div className="flex items-center mb-2 gap-2 justify-end">
                <p className="text-sm text-zinc-500">sort by </p>
                <Select
                  defaultValue="latest"
                  style={{ width: 150 }}
                  options={sortOptions}
                />
              </div>

              {[1, 2, 3, 4].map((v) => {
                return <ReviewCard key={v} />;
              })}
              <div>
                <Pagination align="center" defaultCurrent={1} total={50} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameReviews;
