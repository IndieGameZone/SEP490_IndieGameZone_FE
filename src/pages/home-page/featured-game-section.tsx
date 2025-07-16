import Slider from "react-slick";
import game1CoverImage from "@/assets/mock/game-1-cover-image.webp";
import game1Image1 from "@/assets/mock/game-1-image-1.jpg";
import game1Image2 from "@/assets/mock/game-1-image-2.jpg";
import game1Image3 from "@/assets/mock/game-1-image-3.jpg";
import game1Image4 from "@/assets/mock/game-1-image-4.jpg";
import game2CoverImage from "@/assets/mock/game-2-cover-image.png";
import game2Image1 from "@/assets/mock/game-2-image-1.png";
import game2Image2 from "@/assets/mock/game-2-image-2.png";
import game2Image3 from "@/assets/mock/game-2-image-3.png";
import game2Image4 from "@/assets/mock/game-2-image-4.png";
import game3CoverImage from "@/assets/mock/game-3-cover-image.webp";
import game3Image1 from "@/assets/mock/game-3-image-1.png";
import game3Image2 from "@/assets/mock/game-3-image-2.png";
import game3Image3 from "@/assets/mock/game-3-image-3.png";
import game3Image4 from "@/assets/mock/game-3-image-4.png";
import FeaturedGameCard from "./featured-game-card";

const mockData = [
  {
    id: 1,
    name: "Time to Morp",
    coverImage: game1CoverImage,
    images: [game1Image1, game1Image2, game1Image3, game1Image4],
    genres: ["Adventure", "Normally", "Simulation"],
    price: 260_000,
  },
  {
    id: 2,
    name: "Floating Sandbox",
    coverImage: game2CoverImage,
    images: [game2Image1, game2Image2, game2Image3, game2Image4],
    genres: ["Simulation"],
    price: 0,
  },
  {
    id: 3,
    name: "Baldi's Basics Plus",
    coverImage: game3CoverImage,
    images: [game3Image1, game3Image2, game3Image3, game3Image4],
    genres: ["Action", "Strategy"],
    price: 120_000,
  },
];

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

const FeaturedGameSection = () => {
  return (
    <section className="pb-9">
      <h2 className="my-3 text-2xl font-bold">Featured Games</h2>
      <Slider {...settings}>
        {mockData.map((game) => {
          return (
            <FeaturedGameCard game={game} key={`featured-game-${game.id}`} />
          );
        })}
      </Slider>
    </section>
  );
};

export default FeaturedGameSection;
