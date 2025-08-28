import { Pagination } from "antd";
import useGameStore from "@/store/use-game-store";
import useReviewStore from "@/store/use-review-store";
import { useEffect, useState } from "react";
import Loader from "@/components/loader";
import RatingChart, {
  RatingChartData,
} from "@/components/charts/dev/rating-chart";
import ReviewCard from "@/pages/game-details/game-reviews/review-card";
import GameReviewsSummary from "./game-reviews-summary";
import { getReviewStatistic } from "@/lib/api/review-api";
import { FaStar } from "react-icons/fa";
import { useFilters } from "@/hooks/use-filters";
import { GameReviewFilters } from "@/pages/game-details/game-reviews/game-reviews";
import ReviewFiltersPanel from "@/pages/game-details/game-reviews/review-filters-panel";

// const sortOptions = [
//   {
//     value: "most-helpful",
//     label: "Most helpful",
//   },
//   {
//     value: "latest",
//     label: "Latest",
//   },
// ];

const GameReviewTab = () => {
  const { game } = useGameStore();
  const { reviews, fetchReviewsByGameId, loading, renderKey, pagination } =
    useReviewStore();
  const [ratingChartData, setRatingChartData] = useState<RatingChartData[]>([]);
  const { filters, setFilter, setFilters } = useFilters<GameReviewFilters>(
    {
      page: 1,
      rating: undefined,
    },
    { keepHash: true }
  );

  const fetchReviewStatistic = async (gameId: string) => {
    const result = await getReviewStatistic(gameId);
    if (!result.error) {
      setRatingChartData(result.data);
    }
  };

  const onPaginationChange = (page: number, _: number) => {
    setFilter("page", page);
  };

  useEffect(() => {
    if (game?.id) {
      fetchReviewStatistic(game.id);
      fetchReviewsByGameId(game.id);
      fetchReviewsByGameId(game.id, {
        PageNumber: filters.page,
        PageSize: 10,
        Rating: filters.rating,
      });
    }
  }, [renderKey, filters.page, filters.rating]);

  if (loading) {
    return <Loader />;
  }
  if (!game) return;

  return (
    <div className="p-3">
      <GameReviewsSummary />
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
          <ReviewFiltersPanel
            selectedRating={filters.rating}
            setFilters={setFilters}
          />
          <div className="grid grid-cols-12 mt-3 gap-3">
            <div className="col-span-4">
              <RatingChart data={ratingChartData} />
            </div>
            <div className="col-span-8">
              {/* <div className="flex items-center mb-2 gap-2 justify-end">
                <p className="text-sm text-zinc-500">sort by </p>
                <Select
                  defaultValue="latest"
                  style={{ width: 150 }}
                  options={sortOptions}
                />
              </div> */}
              {reviews.length > 0 ? (
                reviews.map((review) => {
                  return <ReviewCard key={review.id} review={review} />;
                })
              ) : (
                <div className="p-5 rounded bg-zinc-800 mb-3 text-center text-zinc-400">
                  No reviews yet for {game?.name || "this game"}.
                </div>
              )}
              <div>
                <Pagination
                  align="center"
                  current={pagination.currentPage}
                  total={pagination.totalCount}
                  onChange={onPaginationChange}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameReviewTab;
