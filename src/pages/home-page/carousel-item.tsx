import FaultTolerantImage from "@/components/fault-tolerant-image";
import { formatCurrencyVND } from "@/lib/currency";
import { Game } from "@/types/game";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Lightbox from "yet-another-react-lightbox";

interface CarouselItemProps {
  game: Game;
}
const CarouselItem = ({ game }: CarouselItemProps) => {
  const [index, setIndex] = useState(-1);
  const [gameImages, setGameImages] = useState<any[]>([]);
  const [slides, setSlides] = useState<any>([]);
  useEffect(() => {
    setGameImages(
      game.gameImages.map((image) => ({
        src: image.image,
      }))
    );
  }, [game]);

  useEffect(() => {
    setSlides([
      {
        src: game.coverImage,
      },
      ...gameImages,
    ]);
  }, [gameImages]);

  return (
    <div>
      <Lightbox
        index={index}
        slides={slides}
        open={index >= 0}
        close={() => setIndex(-1)}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 h-[280px] lg:h-[400px] gap-3">
        <img
          src={game.coverImage}
          alt=""
          className="w-full h-[280px] lg:h-[400px] object-contain rounded cursor-zoom-in border-2 border-black hover:border-orange-500 duration-300 bg-zinc-950"
          onClick={() => setIndex(0)}
        />
        <div className="flex flex-col gap-3">
          <div className="flex-1">
            <div className="flex justify-between">
              <Link to={`/game/${game.id}`}>
                <h2 className="font-bold text-2xl">{game.name}</h2>
              </Link>
              <p className="font-semibold">
                {game.price == 0 ? "Free" : formatCurrencyVND(game.price)}
              </p>
            </div>
            <div className="flex gap-2 text-sm mt-1">
              {game.gameTags.map((tag, index: number) => {
                return (
                  <Link
                    to={`/search?tag=${tag.tag.id}`}
                    key={`featured-game-${game.id}-genre-${index}`}
                    className="px-2 bg-zinc-700 rounded hover:bg-zinc-800 duration-200"
                  >
                    {tag.tag.name}
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="md:grid grid-cols-2 gap-3 hidden">
            {gameImages.slice(0, 4).map((image: any, index: number) => {
              return (
                <div
                  className="h-[150px]"
                  key={`featured-game-${game.id}-image-${index}`}
                >
                  <FaultTolerantImage
                    src={image.src}
                    alt={game.name + " screenshort " + index}
                    className="bg-zinc-950 object-contain w-full h-full rounded cursor-zoom-in border-2 border-black hover:border-orange-500 duration-300"
                    onClick={() => {
                      setIndex(index + 1);
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarouselItem;
