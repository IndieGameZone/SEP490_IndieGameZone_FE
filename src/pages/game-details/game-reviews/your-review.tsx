import { timeAgo } from "@/lib/date-n-time";
import { Review } from "@/types/review";
import { Button, Rate } from "antd";
import { useState } from "react";
import { CiUser } from "react-icons/ci";
import UpdateReviewForm from "./update-review-form";
import { FaPencil } from "react-icons/fa6";

const YourReview = ({ review }: { review: Review }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [avatarError, setAvatarError] = useState(false);

  if (isEditing)
    return <UpdateReviewForm review={review} setIsEditing={setIsEditing} />;

  return (
    <div className="p-5 bg-zinc-800 rounded drop-shadow">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold">Your Review</h3>
        <Button
          type="primary"
          onClick={() => setIsEditing(true)}
          icon={<FaPencil />}
        >
          Edit your review
        </Button>
      </div>
      <div className="flex gap-5 mt-2">
        {review.user?.avatar && !avatarError ? (
          <img
            src={review.user.avatar}
            alt=""
            className="size-16 rounded-full border-2 border-white object-cover"
            onError={() => {
              setAvatarError(true);
              return false;
            }}
          />
        ) : (
          <div className="size-16 bg-zinc-600 flex items-center justify-center rounded-full border-2 border-white">
            <CiUser className="size-8" />
          </div>
        )}
        <div className="flex-1">
          <p className=" font-bold text-lg mb-1">
            {review.user?.userName}{" "}
            <span className="mb-1 text-zinc-400 font-normal text-sm">
              • {timeAgo(new Date(review.createdAt))}
            </span>
          </p>
          <Rate value={review.rating} disabled />
          <p>{review.comment}</p>
        </div>
      </div>
    </div>
  );
};

export default YourReview;
