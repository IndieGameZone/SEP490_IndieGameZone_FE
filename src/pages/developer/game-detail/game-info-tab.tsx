import AITag from "@/components/ai-tag";
import ExpandableWrapper from "@/components/expandable-wrapper";
import ModerationStatus from "@/components/moderation-status";
import TiptapView from "@/components/tiptap/tiptap-view";
import VisibilityStatus from "@/components/visibility-status";
import { formatCurrencyVND } from "@/lib/currency";
import { formatDate } from "@/lib/date";
import useGameStore from "@/store/use-game-store";
import { Button, Descriptions, DescriptionsProps, Tag } from "antd";
import { useState } from "react";
import { FaEye, FaPencilAlt } from "react-icons/fa";
import ReactPlayer from "react-player";
import { useNavigate } from "react-router-dom";
import Lightbox from "yet-another-react-lightbox";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Slideshow from "yet-another-react-lightbox/plugins/slideshow";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Zoom from "yet-another-react-lightbox/plugins/zoom";

const GameInfoTab = () => {
  const { game } = useGameStore();
  const navigate = useNavigate();
  const [index, setIndex] = useState(-1);

  const handleViewGamePage = () => {
    navigate(`/game/${game?.id}`);
  };

  if (!game) return;

  const infoItems: DescriptionsProps["items"] = [
    {
      key: "game-name",
      label: "Game name",
      children: game?.name,
      span: 3,
    },
    {
      key: "category",
      label: "Category",
      children: game?.category.name,
      span: 1,
    },
    {
      key: "tags",
      label: "Tags",
      children: (
        <div className="flex">
          {game?.gameTags.map((tag) => (
            <Tag key={tag.tag.id} color="orange">
              {tag.tag.name}
            </Tag>
          ))}
        </div>
      ),
      span: 2,
    },
    {
      key: "short-description",
      label: "Short description",
      children: game?.shortDescription,
      span: 3,
    },
    {
      key: "created-date",
      label: "Created date",
      children: game ? formatDate(new Date(game.createdAt)) : "none",
      span: 3,
    },
    {
      key: "average-time",
      label: "Average time",
      children: game?.averageSession + " minute(s)",
      span: 1,
    },
    {
      key: "visibility",
      label: "Visibility",
      children: <VisibilityStatus status={game.visibility} />,
      span: 2,
    },
    {
      key: "price",
      label: "Price",
      children: game?.price != 0 ? formatCurrencyVND(game?.price ?? 0) : "Free",
    },
    {
      key: "allows-donation",
      label: "Allows donation",
      children: game?.allowDonation ? "Yes" : "No",
      span: 2,
    },
    {
      key: "moderation-status",
      label: "Moderation status",
      children: <ModerationStatus status={game.censorStatus} />,
      span: 1,
    },
    {
      key: "moderated-by",
      label: "Moderated by",
      children: game.moderator ? (
        game.moderator.fullname
      ) : game.censorStatus == "Approved" ? (
        <AITag />
      ) : (
        <span className="text-gray-500">none</span>
      ),
      span: 2,
    },
  ];
  const descriptionItems: DescriptionsProps["items"] = [
    {
      key: "description",
      label: "Description",
      children: (
        <ExpandableWrapper>
          <TiptapView value={game?.description} />
        </ExpandableWrapper>
      ),
    },
  ];

  const slides = game
    ? [
        { src: game.coverImage },
        ...game.gameImages.map((image) => ({ src: image.image })),
      ]
    : [];
  return (
    <div className="bg-zinc-900 p-3 grid grid-cols-12 gap-5">
      <Lightbox
        index={index}
        slides={slides}
        open={index >= 0}
        close={() => setIndex(-1)}
        plugins={[Fullscreen, Slideshow, Thumbnails, Zoom]}
      />
      <div className="col-span-12 flex gap-3 justify-end">
        <Button icon={<FaEye />} onClick={handleViewGamePage}>
          View game's page
        </Button>
        <Button icon={<FaPencilAlt />} type="primary">
          Update game
        </Button>
      </div>
      <div className="col-span-4">
        <div className="bg-zinc-800 rounded p-3">
          <h3 className="font-bold mb-2">Cover Image</h3>
          <img
            src={game?.coverImage}
            alt="game's cover image"
            className="aspect-video object-contain bg-zinc-900 rounded highlight-hover cursor-pointer"
            onClick={() => {
              setIndex(0);
            }}
          />

          <h3 className="font-bold mt-4">Game screenshots/images</h3>
          <div className="grid grid-cols-2 mt-2 gap-3">
            {game?.gameImages.map((image, index: number) => {
              return (
                <img
                  src={image.image}
                  key={`game-image-${image.id}`}
                  alt=""
                  className="aspect-video object-contain bg-zinc-800 rounded highlight-hover cursor-pointer"
                  onClick={() => {
                    setIndex(index + 1);
                  }}
                />
              );
            })}
          </div>
          <h3 className="font-bold mt-4">Gameplay/trailer</h3>
          {game?.videoLink ? (
            <ReactPlayer
              className="react-player"
              url={game?.videoLink}
              width="100%"
              height={200}
              controls
            />
          ) : (
            <div className="text-gray-500">None</div>
          )}
        </div>
      </div>

      <div className="col-span-8 bg-zinc-800 p-3 rounded ">
        <Descriptions title="Game Infomation" bordered items={infoItems} />
        <Descriptions
          layout="vertical"
          bordered
          items={descriptionItems}
          style={{ marginTop: 15 }}
        />
      </div>
    </div>
  );
};

export default GameInfoTab;
