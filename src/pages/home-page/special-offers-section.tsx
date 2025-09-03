import Slider from "react-slick";
import { formatCurrencyVND } from "@/lib/currency";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Game } from "@/types/game";
import { searchGames } from "@/lib/api/game-api";
import { FaTag } from "react-icons/fa";
import FaultTolerantImage from "@/components/fault-tolerant-image";

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

const SpecialOffersSection = () => {
  const [games, setGames] = useState<Game[]>([]);

  useEffect(() => {
    fetchSpecialOffers();
  }, []);

  const fetchSpecialOffers = async () => {
    const result = await searchGames({ HasDiscount: true, pageSize: 9 });
    if (!result.error) {
      setGames(result.data.games);
    }
  };

  if (games.length == 0) return;

  const dynamicSettings = {
    ...settings,
    infinite: games.length > 3,
  };

  return (
    <section className="pb-9 ">
      <h2 className="text-2xl font-bold text-center my-5">Special Offers</h2>
      <Slider {...dynamicSettings}>
        {games.map((game) => {
          return (
            <Link
              to={`/game/${game.id}`}
              key={`special-offer-${game.id}`}
              className="rounded highlight-hover overflow-hidden bg-gradient-to-b from-zinc-700 to-zinc-800"
            >
              <FaultTolerantImage
                src={game.coverImage}
                alt=""
                className="h-[180px] w-full object-contain bg-zinc-900"
              />
              <div className="p-2 flex border-t-2 border-orange-500">
                <div className="flex-1">
                  <h3 className="font-semibold">{game.name}</h3>
                  {/* <p className="text-xs text-gray-400">
                    {new Date(game.salesUtil).getDate() -
                      new Date().getDate() >=
                    1
                      ? "Today's deal!"
                      : "Offer ends " + formatDate(new Date(game.salesUtil))}
                  </p> */}
                  <div className="bg-orange-600 font-bold px-2 inline-block rounded text-sm">
                    -{game.discount}% <FaTag className="inline"/>
                  </div>
                </div>
                <div className="text-end">
                  <p className="text-green-400">
                    {formatCurrencyVND(
                      game.price - game.price * (game.discount / 100)
                    )}
                  </p>
                  <p className="line-through text-xs text-gray-400">
                    {formatCurrencyVND(game.price)}
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </Slider>
    </section>
  );
};

export default SpecialOffersSection;
