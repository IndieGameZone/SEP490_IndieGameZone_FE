import ExpandableWrapper from "@/components/expandable-wrapper";
import TiptapView from "@/components/tiptap/tiptap-view";
import { formatCurrencyVND } from "@/lib/currency";
import { formatDate, formatDateTime } from "@/lib/date";
import useGameStore from "@/store/use-game-store";
import usePlatformStore from "@/store/use-platform-store";
import { Button, Descriptions, DescriptionsProps, Tag } from "antd";
import { useEffect, useState } from "react";
import { FaEye, FaPencilAlt } from "react-icons/fa";
import ReactPlayer from "react-player";
import { useNavigate } from "react-router-dom";
import Lightbox from "yet-another-react-lightbox";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Slideshow from "yet-another-react-lightbox/plugins/slideshow";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import FileCard from "../../../components/file-card";
import DeleteGameButton from "./delete-game-button";
import {
  AITag,
  ModerationStatusBadge,
  VisibilityStatus,
} from "@/components/status-tags";
import GameNotFound from "@/pages/errors/game-not-found";
import { CiWarning } from "react-icons/ci";

const GameInfoTab = () => {
  const { game, error } = useGameStore();
  const navigate = useNavigate();
  const [index, setIndex] = useState(-1);
  const { getDefaultPlatforms, fetchPlatforms } = usePlatformStore();
  const { fetchGameFiles, gameFiles, installInstruction } = useGameStore();

  const handleViewGamePage = () => {
    navigate(`/game/${game?.id}`);
  };

  useEffect(() => {
    if (game) {
      fetchPlatforms();
      fetchGameFiles(game.id);
    }
  }, []);

  if (!game) return;
  if (error) {
    return <GameNotFound />;
  }
  const defaultPlatforms = getDefaultPlatforms();
  const infoItems: DescriptionsProps["items"] = [
    {
      key: "game-name",
      label: "Game name",
      children: game?.name,
      span: 2,
    },
    {
      key: "category",
      label: "Category",
      children: game?.category.name,
      span: 1,
    },
    {
      key: "average-time",
      label: "Average time",
      children: game?.averageSession + " minute(s)",
      span: 1,
    },
    {
      key: "tags",
      label: "Tags",
      children: (
        <div className="flex flex-wrap gap-y-2">
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
      span: 2,
    },
    {
      key: "created-date",
      label: "Created date",
      children: game ? (
        formatDate(new Date(game.createdAt))
      ) : (
        <span className="text-gray-500">None</span>
      ),
      span: 1,
    },
    {
      key: "updated-date",
      label: "Updated date",
      children: game.updatedAt ? (
        formatDate(new Date(game.updatedAt))
      ) : (
        <span className="text-gray-500">None</span>
      ),
      span: 1,
    },
    {
      key: "price",
      label: "Price",
      children: game?.price != 0 ? formatCurrencyVND(game?.price ?? 0) : "Free",
      span: 1,
    },
    {
      key: "allows-donation",
      label: "Allows donation",
      children: game?.allowDonation ? "Yes" : "No",
      span: 1,
    },
    {
      key: "visibility",
      label: "Visibility",
      children: <VisibilityStatus status={game.visibility} />,
      span: 1,
    },
    {
      key: "censor-status",
      label: "Censor status",
      children: <ModerationStatusBadge status={game.censorStatus} />,
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
        <span className="text-gray-500">None</span>
      ),
      span: 1,
    },
    {
      key: "censored-at",
      label: "Censored at",
      children: game.censorAt ? (
        formatDateTime(new Date(game.censorAt))
      ) : (
        <span className="text-gray-500">None</span>
      ),
      span: 1,
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

  const installInstructionItems: DescriptionsProps["items"] = [
    {
      key: "install-instruction",
      label: "Install Instruction",
      children: installInstruction ? (
        <ExpandableWrapper>
          <TiptapView value={installInstruction} />
        </ExpandableWrapper>
      ) : (
        <span className="text-gray-500">None</span>
      ),
    },
  ];

  const slides = game
    ? [
        { src: game.coverImage },
        ...game.gameImages.map((image) => ({ src: image.image })),
      ]
    : [];

  if (game.censorReason) {
    infoItems.push({
      key: "censor-reason",
      label: "Reason for censorship",
      children: game.censorReason ? (
        <span className="text-red-400">{game.censorReason}</span>
      ) : (
        <span className="text-gray-500">None</span>
      ),
      span: 3,
    });
  }

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
        <DeleteGameButton />
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
            className="aspect-video object-contain bg-zinc-900 rounded highlight-hover cursor-pointer w-full"
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
        <div className="bg-zinc-800 rounded p-3 mt-3">
          <h3 className="font-bold mb-2">Game files</h3>
          <div className="flex flex-col gap-2">
            {gameFiles.map((file, index) => {
              return (
                <FileCard
                  file={file}
                  key={`game-file-${index}`}
                  defaultPlatforms={defaultPlatforms}
                />
              );
            })}
            {!gameFiles && <span className="text-gray-500">None</span>}
          </div>
        </div>
      </div>

      <div className="col-span-8 bg-zinc-800 p-3 rounded">
        {game.censorStatus == "PendingManualReview" && (
          <div className="bg-orange-900 p-3 rounded mb-2 border-orange-500 border flex gap-3 items-center">
            <CiWarning className="size-9" />
            <div>
              Your game content has been flagged as {" "}
              <span className="font-bold">not safe/appropriate</span> by AI.
              <br />
              Our moderation team will examine your game to ensure it is safe
              before it is made public.
            </div>
          </div>
        )}
        <Descriptions
          title="Game Infomation"
          column={2}
          bordered
          items={infoItems}
        />
        <Descriptions
          column={2}
          layout="vertical"
          bordered
          items={descriptionItems}
          style={{ marginTop: 15 }}
        />
        <Descriptions
          column={2}
          layout="vertical"
          bordered
          items={installInstructionItems}
          style={{ marginTop: 15 }}
        />
      </div>
    </div>
  );
};

export default GameInfoTab;
