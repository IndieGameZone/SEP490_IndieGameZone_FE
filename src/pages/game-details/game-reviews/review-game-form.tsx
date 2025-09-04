import { ReactNode, useState } from "react";
import useAuthStore from "@/store/use-auth-store";
import useGameStore from "@/store/use-game-store";
import { Button, Form, Rate, message } from "antd";
import TextArea from "antd/es/input/TextArea";
import { CiUser } from "react-icons/ci";
import { Link } from "react-router-dom";
import { createReview } from "@/lib/api/review-api";
import useReviewStore from "@/store/use-review-store";
const ratingHints = [
  "Awful, really didn't enjoy it at all",
  "Not great, had many issues",
  "Okay, had some fun but also flaws",
  "Pretty good! I liked it overall",
  "Amazing! I totally loved it 💖",
];

const ReviewGameForm = () => {
  const { game, fetchGameById } = useGameStore();
  const { profile } = useAuthStore();
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [errors, setErrors] = useState<ReactNode[]>([]);
  const [avatarError, setAvatarError] = useState(false);

  const { rerender } = useReviewStore();

  const handlePostReview = async () => {
    if (!profile?.id || !game?.id) {
      messageApi.error("User or game information is missing.");
      return;
    }

    if (!comment.trim()) {
      messageApi.error("Please enter a review comment.");
      return;
    }

    if (rating === 0) {
      setErrors(["Please select a rating before submitting your review."]);
      messageApi.error("Please select a rating before submitting your review.");
      return;
    }

    setLoading(true);
    try {
      const reviewData = { rating, comment };
      const response = await createReview(profile.id, game.id, reviewData);

      if (response.success) {
        messageApi.success("Review posted successfully!");
        rerender();
        setComment("");
        setRating(0);
        fetchGameById(game.id);
      } else {
        messageApi.error(response.error || "Failed to post review.");
      }
    } catch (error) {
      messageApi.error("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-5 bg-zinc-800 rounded drop-shadow">
      {contextHolder}
      <h3 className="text-2xl">
        Write a review for{" "}
        <span className="font-semibold text-orange-500">{game?.name}</span>
      </h3>
      <p className="text-zinc-400">
        Please share your thoughts about this game, including what you liked and
        didn't like, and if you would suggest it to others.
        <br /> Please remember to follow by the{" "}
        <Link to={`/rules-and-guidelines`}>
          <span className="hover:text-white hover:underline font-semibold text-white">
            Rules and Guidelines
          </span>
        </Link>{" "}
        and be respectful.
      </p>
      <div className="flex gap-5 pt-5">
        {profile?.avatar && !avatarError ? (
          <img
            src={profile?.avatar}
            alt=""
            className="size-24 rounded-full border-2 border-white object-cover"
            onError={() => {
              setAvatarError(true);
              return false;
            }}
          />
        ) : (
          <div className="size-24 bg-zinc-500 flex items-center justify-center rounded-full border-2 border-white">
            <CiUser className="size-14" />
          </div>
        )}
        <div className="flex-1">
          <TextArea
            placeholder="Your review"
            className="w-full"
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <div className="pt-3 flex justify-between">
            <div>
              <Rate
                defaultValue={0}
                value={rating}
                onChange={(value) => {
                  setRating(value);
                  setErrors([]);
                }}
                tooltips={ratingHints}
              />
              <p className="text-xs text-zinc-500">
                How much will you rate this game?
              </p>
              <Form.ErrorList errors={errors} className="text-red-400 mb-1" />
            </div>
            <Button
              type="primary"
              onClick={handlePostReview}
              loading={loading}
              disabled={loading}
            >
              Post Review
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewGameForm;
