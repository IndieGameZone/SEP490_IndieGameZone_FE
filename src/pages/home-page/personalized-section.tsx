import GameCard from "@/components/game-card";
import Loader from "@/components/loader";
import { getRecommendedGames } from "@/lib/api/game-api";
import useAuthStore from "@/store/use-auth-store";
import { Game } from "@/types/game";
import { Button } from "antd";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";

const settings = {
  dots: true,
  infinite: true,
  speed: 500,
  autoplay: true,
  autoplaySpeed: 5000,
  slidesToShow: 3,
  slidesToScroll: 3,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 768,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 640,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      },
    },
  ],
  appendDots: (dots: any) => <ul>{dots}</ul>,
  customPaging: () => (
    <div className="ft-slick__dots--custom">
      <div className="loading" />
    </div>
  ),
};

const PersonalizedSection = () => {
  const [recommendedGames, setRecommendedGames] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { profile } = useAuthStore();
  useEffect(() => {
    fetchRecommendedGames();
  }, [profile]);

  const fetchRecommendedGames = async () => {
    if (!profile) return;
    setIsLoading(true);
    const result = await getRecommendedGames(profile.id);
    setIsLoading(false);
    if (!result.error) {
      setRecommendedGames(result.data);
    }
  };

  if (profile && !isLoading && recommendedGames.length == 0) return;
  if (!profile) {
    return (
      <div className="bg-zinc-800 border-2 border-zinc-200 rounded text-center p-5 flex flex-col gap-3">
        <p>
          Sign in to see <span className="font-semibold">personalized</span>{" "}
          recommendations
        </p>
        <Link to={"/log-in"}>
          <Button type="primary">Log in</Button>
        </Link>
        <div>
          Or{" "}
          <Link
            to={`/sign-up`}
            className="underline text-orange-500 hover:text-orange-400 duration-300"
          >
            Sign up
          </Link>{" "}
          and join IGZ for free
        </div>
      </div>
    );
  } else {
    return (
      <section className="pb-9">
        <h2 className="my-3 text-2xl font-bold text-center">
          Based on Your Interests
        </h2>
        {isLoading ? (
          <div className="py-3">
            <Loader type="inline" />
          </div>
        ) : (
          <Slider {...settings}>
            {recommendedGames.map((game) => {
              return <GameCard game={game} key={game.id} />;
            })}
          </Slider>
        )}
      </section>
    );
  }
};

export default PersonalizedSection;
