import { Pagination, Radio, Select } from "antd";
import useGameStore from "@/store/use-game-store";
import useReviewStore from "@/store/use-review-store";
import { useEffect, useState } from "react";
import Loader from "@/components/loader";
import RatingChart, {
  RatingChartData,
} from "@/components/charts/dev/rating-chart";
import ReviewCard from "@/pages/game-details/game-reviews/review-card";
import GameSummaryReview from "./game-summary-review";
import { getReviewStatistic } from "@/lib/api/review-api";
import { FaStar } from "react-icons/fa";

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
const GameReviewTab = () => {
  const { game } = useGameStore();
  const { reviews, fetchReviewsByGameId, loading, renderKey } =
    useReviewStore();
  const [ratingChartData, setRatingChartData] = useState<RatingChartData[]>([]);

  const fetchReviewStatistic = async (gameId: string) => {
    const result = await getReviewStatistic(gameId);
    if (!result.error) {
      setRatingChartData(result.data);
    }
  };

  useEffect(() => {
    if (game?.id) {
      fetchReviewStatistic(game.id);
      fetchReviewsByGameId(game.id);
    }
  }, [renderKey]);

  if (loading) {
    return <Loader />;
  }
  if (!game) return;

  return (
    <div className="p-3">
      <GameSummaryReview />
      <div className="py-3">
        <div>
          <div className="flex justify-between">
            <h3 className="text-xl font-semibold">
              Players reviews for {game?.name}
            </h3>
            <div className="flex gap-2 text-sm items-end">
              <span className="uppercase text-zinc-400 text-xs">
                Average rating:
              </span>
              {game.numberOfReviews > 0 ? (
                <div className="flex items-center gap-2">
                  {game.averageRating.toFixed(1)}
                  <FaStar className="text-yellow-400" />({game.numberOfReviews}{" "}
                  reviews)
                </div>
              ) : (
                <p className="text-zinc-400">No rating</p>
              )}
            </div>
          </div>
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
              <RatingChart data={ratingChartData} />
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
              {reviews.length > 0 ? (
                reviews.map((review) => {
                  return <ReviewCard key={review.id} review={review} />;
                })
              ) : (
                <div className="p-5 rounded bg-zinc-800 mb-3 text-center text-zinc-400">
                  No reviews yet for {game?.name || "this game"}. Be the first
                  to share your thoughts!
                </div>
              )}
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

export default GameReviewTab;
