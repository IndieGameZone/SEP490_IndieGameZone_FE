import GameCard from "@/components/game-card";
import Loader from "@/components/loader";
import { getTodaySponsoredGames } from "@/lib/api/commercial-package-api";
import { Game } from "@/types/game";
import { useEffect, useState } from "react";
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

const SponsoredGamesSections = () => {
  const [sponsoredGames, setSponsoredGames] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchSponsoredGames();
  }, []);

  const fetchSponsoredGames = async () => {
    setIsLoading(true);
    const result = await getTodaySponsoredGames();
    setIsLoading(false);
    if (!result.error) {
      setSponsoredGames(result.data);
    }
  };

  if (!isLoading && setSponsoredGames.length == 0) return;

  const dynamicSettings = {
    ...settings,
    infinite: sponsoredGames.length > 3,
  };

  return (
    <section className="pb-9">
      <h2 className="my-3 text-2xl font-bold text-center">Sponsored Games</h2>
      {isLoading ? (
        <div className="py-3">
          <Loader type="inline" />
        </div>
      ) : (
        <Slider {...dynamicSettings}>
          {sponsoredGames.map((game) => {
            return (
              <GameCard game={{ ...game, hasCommercial: true }} key={game.id} />
            );
          })}
        </Slider>
      )}
    </section>
  );
};

export default SponsoredGamesSections;
