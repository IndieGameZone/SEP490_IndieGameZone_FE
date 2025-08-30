import { useGlobalMessage } from "@/components/message-provider";
import { getReviewByUserId } from "@/lib/api/review-api";
import { Review } from "@/types/review";
import { Empty, Tooltip } from "antd";
import { useEffect, useState } from "react";
import ReviewCard from "../game-details/game-reviews/review-card";
import useAuthStore from "@/store/use-auth-store";
import Loader from "@/components/loader";
import { useNavigate } from "react-router-dom";

const ViewUserReviews = () => {
  const { profile } = useAuthStore();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const messageApi = useGlobalMessage();
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserReviews();
  }, [profile]);

  const fetchUserReviews = async () => {
    if (!profile) return;
    setLoading(true);
    const result = await getReviewByUserId(profile.id);
    setLoading(false);
    if (!result.error) {
      setReviews(result.data);
    } else {
      messageApi.error("Failed to load reviews. Please try again!");
    }
  };
  const handleReviewClick = (gameId: string) => {
    navigate(`/game/${gameId}#reviews`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <Loader />
      </div>
    );
  }

  return (
    <div className="space-y-4 p-5">
      {reviews.length === 0 ? (
        <Empty description="No reviews yet" className="bg-zinc-800 p-8 rounded-lg border border-zinc-700" />
      ) : (
        reviews.map((review) => {
          const gameName = review.game?.name || "Unknown Game";
          const tooltipTitle = `Review for game: ${gameName}`;
          const gameId = review.game?.id;

          return (
            <Tooltip key={review.id} title={tooltipTitle} placement="topRight" mouseEnterDelay={0.5}>
              <div
                className="cursor-pointer transition-all hover:opacity-90"
                onClick={() => gameId && handleReviewClick(gameId)}
              >
                {" "}
                <ReviewCard review={review} hideReportButton={true} />
              </div>
            </Tooltip>
          );
        })
      )}
    </div>
  );
};

export default ViewUserReviews;
