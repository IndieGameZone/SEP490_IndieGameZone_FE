import useGameStore from "@/store/use-game-store";
import { Review } from "@/types/review";
import { Pagination } from "antd";
import ReviewCard from "./review-card";
import useAuthStore from "@/store/use-auth-store";
import { GameReviewFilters } from "./game-reviews";

// const sortOptions = [
//   { value: "most-helpful", label: "Most helpful" },
//   { value: "latest", label: "Latest" },
// ];

interface ReviewListProps {
  reviews: Review[];
  page: number;
  totalCount: number;
  setFilter: (key: keyof GameReviewFilters, value: number | undefined) => void;
}

const ReviewList = ({
  reviews,
  page,
  totalCount,
  setFilter,
}: ReviewListProps) => {
  const { game } = useGameStore();
  const { profile } = useAuthStore();
  const filteredReviews = reviews.filter(({ user }) => {
    if (!user || !profile) return true;
    return user.id !== profile.id;
  });

  const onPaginationChange = (page: number, _: number) => {
    setFilter("page", page);
  };

  return (
    <div className="col-span-8">
      {/* <div className="flex items-center mb-2 gap-2 justify-end">
        <p className="text-sm text-zinc-500">sort by</p>
        <Select
          defaultValue="latest"
          style={{ width: 150 }}
          options={sortOptions}
        />
      </div> */}

      {filteredReviews.length > 0 ? (
        filteredReviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))
      ) : (
        <div className="p-5 rounded bg-zinc-800 mb-3 text-center text-zinc-400">
          No reviews yet for {game?.name || "this game"}. Be the first to share
          your thoughts!
        </div>
      )}

      <Pagination
        align="center"
        current={page}
        total={totalCount}
        onChange={onPaginationChange}
      />
    </div>
  );
};

export default ReviewList;
