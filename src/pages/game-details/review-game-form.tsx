import useAuthStore from "@/store/use-auth-store";
import useGameStore from "@/store/use-game-store";
import { Button, Rate } from "antd";
import TextArea from "antd/es/input/TextArea";
import { CiUser } from "react-icons/ci";
import { Link } from "react-router-dom";

const ReviewGameForm = () => {
  const { game } = useGameStore();
  const { profile } = useAuthStore();
  return (
    <div className="p-5 bg-zinc-800 rounded drop-shadow">
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
        {profile?.avatar ? (
          <img
            src={profile?.avatar}
            alt=""
            className="size-24 rounded-full border-2 border-white object-cover"
          />
        ) : (
          <div className="size-24 bg-zinc-500 flex items-center justify-center rounded-full border-2 border-white">
            <CiUser className="size-14" />
          </div>
        )}
        <div className="flex-1">
          <TextArea placeholder="Your review" className="w-full" rows={4} />
          <div className="pt-3 flex justify-between">
            <div>
              <Rate defaultValue={3}/>
              <p className="text-xs text-zinc-500">
                How much will you rate this game?
              </p>
            </div>
            <Button type="primary">Post Review</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewGameForm;
