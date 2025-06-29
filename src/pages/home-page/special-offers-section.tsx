import Slider from "react-slick";
import game4CoverImage from "@/assets/mock/game-4-cover-image.jpg";
import game5CoverImage from "@/assets/mock/game-5-cover-image.jpg";
import game6CoverImage from "@/assets/mock/game-6-cover-image.jpg";
import game7CoverImage from "@/assets/mock/game-7-cover-image.jpg";
import { formatCurrencyVND } from "@/lib/currency";
import { Link } from "react-router-dom";
import { formatDate } from "@/lib/date-n-time";

const today = new Date();
const salesDate1 = new Date(
  new Date().setDate(today.getDate() + 1)
).toISOString();
const salesDate2 = new Date(
  new Date().setDate(today.getDate() + 7)
).toISOString();
const settings = {
  dots: true,
  infinite: true,
  speed: 500,
  autoplay: true,
  autoplaySpeed: 5000,
  slidesToShow: 3,
  slidesToScroll: 3,
  appendDots: (dots: any) => <ul>{dots}</ul>,
  customPaging: () => (
    <div className="ft-slick__dots--custom">
      <div className="loading" />
    </div>
  ),
};

const mockData = [
  {
    id: 4,
    name: "Kenshi",
    coverImage: game4CoverImage,
    price: 250_000,
    sales: 70,
    salesUtil: salesDate1,
  },
  {
    id: 5,
    name: "Cuphead",
    coverImage: game5CoverImage,
    price: 188_000,
    sales: 30,
    salesUtil: salesDate2,
  },
  {
    id: 6,
    name: "Sifu",
    coverImage: game6CoverImage,
    price: 373_000,
    sales: 60,
    salesUtil: salesDate2,
  },
  {
    id: 7,
    name: "The Headliners",
    coverImage: game7CoverImage,
    price: 115_000,
    sales: 30,
    salesUtil: salesDate2,
  },
];

const SpecialOffersSection = () => {
  return (
    <section className="pb-9 ">
      <h2 className="text-2xl font-bold text-center my-5">Special Offers</h2>
      <Slider {...settings}>
        {mockData.map((game) => {
          return (
            <Link
              to={`/game/${game.id}`}
              key={`special-offer-${game.id}`}
              className="rounded highlight-hover overflow-hidden bg-gradient-to-b from-zinc-700 to-zinc-800"
            >
              <div className="relative">
                <img
                  src={game.coverImage}
                  alt=""
                  className="h-[180px] w-full object-cover"
                />
                <div className="absolute bg-orange-600 font-bold bottom-0 right-0 py-1 px-2 drop-shadow rounded-tl-lg">
                  -{game.sales}%
                </div>
              </div>

              <div className="p-2 flex border-t-2 border-orange-500">
                <div className="flex-1">
                  <h3 className="font-semibold">{game.name}</h3>
                  <p className="text-xs text-gray-400">
                    {new Date(game.salesUtil).getDate() -
                      new Date().getDate() >= 1
                      ? "Today's deal!"
                      : "Offer ends " +
                        formatDate(new Date(game.salesUtil))}
                  </p>
                </div>
                <div className="text-end">
                  <p>
                    {formatCurrencyVND(
                      game.price - game.price * (game.sales / 100)
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
