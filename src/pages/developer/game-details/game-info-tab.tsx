import ExpandableWrapper from "@/components/wrappers/expandable-wrapper";
import TiptapView from "@/components/tiptap/tiptap-view";
import { formatCurrencyVND } from "@/lib/currency";
import { formatDate, formatDateTime, formatDuration } from "@/lib/date-n-time";
import useGameStore from "@/store/use-game-store";
import usePlatformStore from "@/store/use-platform-store";
import { Button, Descriptions, DescriptionsProps, Tag } from "antd";
import { useEffect, useMemo, useState } from "react";
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
import { CiClock1, CiWarning } from "react-icons/ci";
import ViewCensorLogButton from "../../../components/buttons/view-censor-log-button";
import { GameCensorLog } from "@/types/game";
import ViewAllVersionButton from "@/components/buttons/view-all-version-button";
import FaultTolerantImage from "@/components/fault-tolerant-image";

const GameInfoTab = () => {
  const { game, error } = useGameStore();
  const navigate = useNavigate();
  const [index, setIndex] = useState(-1);
  const { getDefaultPlatforms, fetchPlatforms } = usePlatformStore();
  const {
    fetchGameFiles,
    gameFiles,
    installInstruction,
    fetchGameCensorLog,
    gameCensorLogs,
  } = useGameStore();

  const handleViewGamePage = () => {
    navigate(`/game/${game?.id}`);
  };

  const handleGoToUpdate = () => {
    navigate(`/dev/update-game/${game?.id}`);
  };

  useEffect(() => {
    if (game) {
      fetchPlatforms();
      fetchGameFiles(game.id);
      fetchGameCensorLog(game.id);
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

  const activeFiles = useMemo(() => {
    return gameFiles.filter((x) => x.isActive);
  }, [gameFiles]);

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
      children: formatDuration(game.averageSession),
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
      label: (
        <div>
          Censor status <ViewCensorLogButton />
        </div>
      ),
      children: <ModerationStatusBadge status={game.censorStatus} />,
      span: 1,
    },
    {
      key: "moderated-by",
      label: "Moderated by",
      children: (() => {
        const latestLog = gameCensorLogs
          .filter(
            (log: GameCensorLog) =>
              log.censorStatus === "Approved" || log.censorStatus === "Rejected"
          )
          .sort(
            (a: GameCensorLog, b: GameCensorLog) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )[0];

        if (latestLog?.moderator) {
          return latestLog.moderator.fullname;
        }
        if (game.censorStatus === "Approved" && !latestLog?.moderator) {
          return <AITag />;
        }
        return <span className="text-gray-500">None</span>;
      })(),
      span: 1,
    },
    {
      key: "censored-at",
      label: "Censored at",
      children: (() => {
        const latestLog = gameCensorLogs
          .filter(
            (log: GameCensorLog) =>
              log.censorStatus === "Approved" || log.censorStatus === "Rejected"
          )
          .sort(
            (a: GameCensorLog, b: GameCensorLog) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )[0];
        return latestLog ? (
          formatDateTime(new Date(latestLog.createdAt))
        ) : (
          <span className="text-gray-500">None</span>
        );
      })(),
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
      label: "Install Instructions",
      children: installInstruction ? (
        <ExpandableWrapper>
          <div className="font-mono">
            <TiptapView value={installInstruction} />
          </div>
        </ExpandableWrapper>
      ) : (
        <span className="text-gray-500">None</span>
      ),
    },
  ];

  const versionDescriptionItems: DescriptionsProps["items"] = [
    {
      key: "version-description",
      label: "Version Notes",
      children: game.versionDescription ? (
        <ExpandableWrapper>
          <div className="font-mono">
            <TiptapView value={game.versionDescription} />
          </div>
        </ExpandableWrapper>
      ) : (
        <span className="text-gray-500">None</span>
      ),
    },
  ];

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
        <Button
          icon={<FaPencilAlt />}
          type="primary"
          onClick={handleGoToUpdate}
        >
          Update game
        </Button>
      </div>
      <div className="col-span-4">
        <div className="bg-zinc-800 rounded p-3">
          <h3 className="font-bold mb-2">Cover Image</h3>
          <FaultTolerantImage
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
                <FaultTolerantImage
                  src={image.image}
                  key={`game-image-${image.id}`}
                  alt=""
                  className="aspect-video object-contain bg-zinc-900 rounded highlight-hover cursor-pointer"
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
            {activeFiles.map((file, index) => {
              return (
                <FileCard
                  file={file}
                  key={`game-file-${index}`}
                  defaultPlatforms={defaultPlatforms}
                />
              );
            })}
            {!gameFiles && <span className="text-gray-500">None</span>}
            <ViewAllVersionButton />
          </div>
        </div>
      </div>

      <div className="col-span-8 bg-zinc-800 p-3 rounded">
        {game.censorStatus == "PendingManualReview" && (
          <div className="bg-orange-900 p-3 rounded mb-2 border-orange-500 border flex gap-3 items-center">
            <CiClock1 className="size-10" />
            <div>
              <p className="font-semibold">
                Right now, your game going through a review process.
              </p>
              <p className="text-sm">
                We're just doing the final checks, so it'll be available to the
                public soon!
              </p>
            </div>
          </div>
        )}
        {game.censorStatus == "Rejected" && (
          <div className="bg-red-900 p-3 rounded mb-2 border-red-500 border flex gap-3 items-center">
            <CiWarning className="size-10" />
            <div>
              <p className="font-semibold">
                We've completed the review, and unfortunately, your game hasn't
                been approved.
              </p>
              <p className="text-sm">
                Please check the review notes, make the necessary changes, and
                feel free to submit again when you're ready!
              </p>
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
          items={versionDescriptionItems}
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
