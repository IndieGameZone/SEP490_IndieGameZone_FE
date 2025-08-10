import { useGlobalMessage } from "@/components/message-provider";
import { getReviewByUserId } from "@/lib/api/review-api";
import { Review } from "@/types/review";
import { Empty, Spin } from "antd";
import { useEffect, useState } from "react";
import ReviewCard from "../game-details/review-card";
import useAuthStore from "@/store/use-auth-store";
import Loader from "@/components/loader";

const ViewUserReviews = () => {
  const { profile } = useAuthStore();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const messageApi = useGlobalMessage();

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
        reviews.map((review) => <ReviewCard key={review.id} review={review} />)
      )}
    </div>
  );
};

export default ViewUserReviews;
