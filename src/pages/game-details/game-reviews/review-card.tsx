import { timeAgo } from "@/lib/date-n-time";
import { Avatar, Button, message, Rate, Tooltip } from "antd";
import { CiUser } from "react-icons/ci";
import { FaFlag } from "react-icons/fa";
import { Review } from "@/types/review";


const ReviewCard = ({ review }: { review: Review }) => {
  return (
    <div className="p-3 rounded bg-zinc-800 mb-3">
      <div className="flex gap-3">
        <Avatar
          src={review.user?.avatar || "/default-avatar.png"}
          icon={<CiUser />}
          size={40}
          alt={`${review.user?.userName || "Unknown"}'s avatar`}
        />
        <div className="flex-1">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="font-bold text-white">{review.user?.userName || "Unknown"}</p>
              <p className="text-xs text-zinc-500">
                {review.createdAt ? timeAgo(new Date(review.createdAt)) : "Unknown date"}
              </p>
            </div>
            <Tooltip title="Report this review">
              <Button shape="circle" icon={<FaFlag />} onClick={() => message.info(`Reported review ${review.id}`)} />
            </Tooltip>
          </div>
          <div className="my-1">
            <Rate disabled value={review.rating || 0} />
          </div>
          <p className="text-white">{review.comment || "No comment provided"}</p>
          {/* <div className="mt-1">
            <p className="text-xs text-zinc-500">Was this review helpful?</p>
            <div className="flex gap-3 mt-1 items-center">
              <div className="flex gap-1 items-center">
                <span>{review.likes || 0}</span>
                <Button
                  type="text"
                  icon={<AiFillLike />}
                  shape="circle"
                  onClick={() => message.info(`Liked review ${review.id}`)}
                />
              </div>
              <div className="flex gap-1 items-center">
                <span>{review.dislikes || 0}</span>
                <Button
                  type="text"
                  icon={<AiFillDislike />}
                  shape="circle"
                  onClick={() => message.info(`Disliked review ${review.id}`)}
                />
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;
