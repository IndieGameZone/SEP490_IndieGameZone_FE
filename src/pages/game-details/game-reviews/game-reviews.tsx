import { useEffect, useState } from "react";
import useGameStore from "@/store/use-game-store";
import useAuthStore from "@/store/use-auth-store";
import useReviewStore from "@/store/use-review-store";

import Loader from "@/components/loader";
import ReviewGameForm from "./review-game-form";
import RatingChart, {
  RatingChartData,
} from "@/components/charts/dev/rating-chart";

import { checkGameOwnership } from "@/lib/api/game-api";
import { getExistingReview, getReviewStatistic } from "@/lib/api/review-api";
import { Review } from "@/types/review";
import ReviewFiltersPanel from "./review-filters-panel";
import YourReview from "./your-review";
import ReviewList from "./review-list";
import { useFilters } from "@/hooks/use-filters";

export type GameReviewFilters = {
  page: number;
  rating: number | undefined;
};

const GameReviews = () => {
  const { game } = useGameStore();
  const { profile } = useAuthStore();
  const { reviews, fetchReviewsByGameId, loading, renderKey, pagination } =
    useReviewStore();

  const [isGameOwned, setIsGameOwned] = useState(false);
  const [existingReview, setExistingReview] = useState<Review>();
  const [ratingChartData, setRatingChartData] = useState<RatingChartData[]>([]);
  const { filters, setFilter, setFilters } = useFilters<GameReviewFilters>(
    {
      page: 1,
      rating: undefined,
    },
    { keepHash: true }
  );

  useEffect(() => {
    if (!game?.id) return;
    getReviewStatistic(game.id).then((result) => {
      if (!result.error) setRatingChartData(result.data);
    });
  }, [game?.id]);

  useEffect(() => {
    if (!game?.id || !profile) return;
    getExistingReview(profile.id, game.id).then((result) => {
      if (!result.error && result.data.length) {
        setExistingReview(result.data[0]);
      }
    });
  }, [renderKey, game?.id, profile]);

  useEffect(() => {
    if (!game?.id || !profile) return;
    checkGameOwnership(profile.id, game.id).then((result) => {
      if (!result.error) setIsGameOwned(result.data ?? false);
    });
  }, [game?.id, profile]);

  useEffect(() => {
    if (!game?.id) return;
    fetchReviewsByGameId(game.id, {
      PageNumber: filters.page,
      PageSize: 10,
      Rating: filters.rating,
    });
  }, [renderKey, game?.id, filters.page, filters.rating]);

  if (loading) return <Loader />;

  const isDev = profile && game?.developer.id === profile.id;

  return (
    <div className="p-3">
      {isGameOwned && profile && !isDev && !existingReview && (
        <ReviewGameForm />
      )}
      {existingReview && <YourReview review={existingReview} />}
      {profile && !isGameOwned && (
        <p className="p-3 rounded border border-zinc-700 text-zinc-300 bg-zinc-800">
          To share your thoughts and write a review, you'll need to download the
          game first. Once you've had a chance to play, we'd love to hear what
          you think!
        </p>
      )}

      <div className="py-3">
        <h3 className="text-xl font-semibold">
          Players reviews for {game?.name}
        </h3>
        <hr className="my-1 border-zinc-600" />

        <ReviewFiltersPanel selectedRating={filters.rating} setFilters={setFilters} />
        <div className="grid grid-cols-12 mt-3 gap-3">
          <div className="col-span-4">
            <RatingChart data={ratingChartData} />
          </div>

          <ReviewList
            reviews={reviews}
            page={filters.page}
            setFilter={setFilter}
            totalCount={pagination.totalCount}
          />
        </div>
      </div>
    </div>
  );
};

export default GameReviews;
