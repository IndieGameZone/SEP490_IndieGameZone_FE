import Slider from "react-slick";
import CarouselItem from "./carousel-item";
import { useEffect, useState } from "react";
import { Game } from "@/types/game";
import { getTodayCarousel } from "@/lib/api/commercial-package-api";
import { useGlobalMessage } from "@/components/message-provider";

const settings = {
  dots: true,
  infinite: true,
  fade: true,
  speed: 500,
  autoplay: true,
  autoplaySpeed: 5000,
  slidesToShow: 1,
  slidesToScroll: 1,
  appendDots: (dots: any) => <ul>{dots}</ul>,
  customPaging: () => (
    <div className="ft-slick__dots--custom">
      <div className="loading" />
    </div>
  ),
};

const CarouselSection = () => {
  const [featuredGames, setFeaturedGames] = useState<Game[]>([]);
  const messageApi = useGlobalMessage();
  useEffect(() => {
    fetchCarousel();
  }, []);

  const fetchCarousel = async () => {
    const result = await getTodayCarousel();
    if (result.error) {
      messageApi.error("Failed to load carousel.");
    } else {
      setFeaturedGames(result.data);
    }
  };
  if (featuredGames.length == 0) return;

  return (
    <section className="pb-9">
      <h2 className="my-3 text-2xl font-bold">Featured Games</h2>
      <Slider {...settings}>
        {featuredGames.map((game) => {
          return <CarouselItem game={game} key={`featured-game-${game.id}`} />;
        })}
      </Slider>
    </section>
  );
};

export default CarouselSection;
