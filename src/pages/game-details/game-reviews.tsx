import { Pagination, Radio, Select } from "antd";
import ReviewGameForm from "./review-game-form";
import useGameStore from "@/store/use-game-store";
import RatingChart, { RatingChartData } from "@/components/charts/dev/rating-chart";
import useAuthStore from "@/store/use-auth-store";
import ReviewCard from "./review-card";
import useReviewStore from "@/store/use-review-store";
import { useEffect, useState } from "react";
import Loader from "@/components/loader";
import { checkGameOwnership } from "@/lib/api/game-api";
import { getReviewStatistic } from "@/lib/api/review-api";

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
  const [isGameOwned, setIsGameOwned] = useState(false);
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
      fetchReviewsByGameId(game.id);
      fetchReviewStatistic(game.id);
    }
  }, [renderKey]);

  useEffect(() => {
    (async () => {
      if (!game || !profile) return;
      const result = await checkGameOwnership(profile.id, game.id);
      if (result.error) {
        console.log(result.error);
      } else {
        setIsGameOwned(result.data ?? false);
      }
    })();
  }, [game, profile]);

  if (loading) {
    return <Loader />;
  }
  const isDev = profile && game?.developer.id == profile?.id;
  return (
    <div className="p-3">
      {isGameOwned && profile && !isDev && <ReviewGameForm />}
      {profile && (
        <p className="p-3 rounded border border-zinc-700 text-zinc-300 bg-zinc-800">
          To share your thoughts and write a review, you'll need to download the
          game first. Once you've had a chance to play, we'd love to hear what
          you think
        </p>
      )}
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
              <RatingChart data={ratingChartData}/>
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

export default GameReviews;
