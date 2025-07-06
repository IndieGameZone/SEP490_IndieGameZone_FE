import useGameStore from "@/store/use-game-store";
import { GameStatus, GameVisibility } from "@/types/game";
import { Form } from "antd";
import { useEffect, useMemo, useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Slideshow from "yet-another-react-lightbox/plugins/slideshow";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Zoom from "yet-another-react-lightbox/plugins/zoom";

type FieldType = {
  name: string;
  coverImage: string;
  videoLink: string;
  description: string;
  shortDescription: string;
  installInstruction: string;
  screenshots: string[];
  allowDonation: boolean;
  releaseStatus: GameStatus;
  visibility: GameVisibility;
  price: number;
  averageSession: number;
  ageRestrictionId: string;
  categoryId: string;
  languageIds: string[];
  tagIds: string[];
};

const UpdateGameMediaAssets = () => {
  const { game } = useGameStore();
  const [form] = Form.useForm<FieldType>();
  const [index, setIndex] = useState(-1);

  useEffect(() => {
    if (game) {
      form.setFieldsValue({
        ageRestrictionId: game.ageRestriction.id,
        allowDonation: game.allowDonation,
        averageSession: game.averageSession,
        categoryId: game.category.id,
        coverImage: game.coverImage,
        description: game.description,
        installInstruction: game.installInstruction,
        languageIds: game.gameLanguages.map((x) => x.language.id),
        name: game.name,
        price: game.price,
        releaseStatus: game.status,
        shortDescription: game.shortDescription,
        tagIds: game.gameTags.map((x) => x.tag.id),
        videoLink: game.videoLink,
        visibility: game.visibility,
      });
    }
  }, []);

  const slides = useMemo(() => {
    return game
      ? [
          { src: game.coverImage },
          ...game.gameImages.map((image) => ({ src: image.image })),
        ]
      : [];
  }, [game]);

  return (
    <div className="p-5 bg-zinc-900">
      <Lightbox
        index={index}
        slides={slides}
        open={index >= 0}
        close={() => setIndex(-1)}
        plugins={[Fullscreen, Slideshow, Thumbnails, Zoom]}
      />
      <h2 className="text-2xl mb-3">Game Media Assets</h2>
      <h3 className="font-bold mb-2 text-lg">Cover Image</h3>
      <div className="grid grid-cols-2">
        <img
          src={game?.coverImage}
          alt="game's cover image"
          className="aspect-video object-contain bg-zinc-100 rounded highlight-hover cursor-pointer w-full"
          onClick={() => {
            setIndex(0);
          }}
        />
      </div>
    </div>
  );
};

export default UpdateGameMediaAssets;
