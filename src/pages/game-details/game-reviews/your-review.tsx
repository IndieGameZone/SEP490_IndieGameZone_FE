import { timeAgo } from "@/lib/date-n-time";
import { Review } from "@/types/review";
import { Button, Rate } from "antd";
import { CiUser } from "react-icons/ci";

const YourReview = ({ review }: { review: Review }) => (
  <div className="p-5 bg-zinc-800 rounded drop-shadow">
    <div className="flex justify-between items-center">
      <h3 className="text-xl font-bold">Your Review</h3>
      <Button type="primary">Edit your review</Button>
    </div>
    <div className="flex gap-5 mt-2">
      {review.user?.avatar ? (
        <img
          src={review.user.avatar}
          alt=""
          className="size-16 rounded-full border-2 border-white object-cover"
        />
      ) : (
        <div className="size-16 bg-zinc-500 flex items-center justify-center rounded-full border-2 border-white">
          <CiUser className="size-14" />
        </div>
      )}
      <div className="flex-1">
        <p className=" font-bold text-lg mb-1">
          {review.user?.userName}{" "}
          <span className="mb-1 text-zinc-400 font-normal text-sm">
            • {timeAgo(new Date(review.createdAt))}
          </span>
        </p>
        <Rate value={review.rating} />
        <p>{review.comment}</p>
      </div>
    </div>
  </div>
);

export default YourReview;
