import ExpandableWrapper from "@/components/wrappers/expandable-wrapper";
import FaultTolerantImage from "@/components/fault-tolerant-image";
import FileCard from "@/components/file-card";
import Loader from "@/components/loader";
import {
  AITag,
  ModerationStatusBadge,
  VisibilityStatus,
} from "@/components/status-tags";
import TiptapView from "@/components/tiptap/tiptap-view";
import ViewAllVersionButton from "@/components/buttons/view-all-version-button";
import ViewCensorLogButton from "@/components/buttons/view-censor-log-button";
import { updateGameActivation } from "@/lib/api/game-api";
import { formatCurrencyVND } from "@/lib/currency";
import { formatDate, formatDateTime, formatDuration } from "@/lib/date-n-time";
import DeleteGameButton from "@/pages/developer/game-details/delete-game-button";
import GameNotFound from "@/pages/errors/game-not-found";
import useAuthStore from "@/store/use-auth-store";
import useGameStore from "@/store/use-game-store";
import usePlatformStore from "@/store/use-platform-store";
import { GameCensorLog } from "@/types/game";
import {
  Button,
  Descriptions,
  DescriptionsProps,
  Tag,
  message,
  Modal,
  Input,
} from "antd";
import { useEffect, useState } from "react";
import { FaCheck, FaEye, FaKey, FaRegCopy } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import ReactPlayer from "react-player";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import Lightbox from "yet-another-react-lightbox";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Slideshow from "yet-another-react-lightbox/plugins/slideshow";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import { GameKey } from "@/types/game-key";
import { useClipboard } from "@/hooks/use-clipboard";
import ModGameKeyModal from "./mod-game-key-modal";
import ViewPriceLogButton from "@/components/buttons/view-price-log-button";

const AdminGameDetail = () => {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const {
    fetchGameById,
    loading,
    error,
    game,
    fetchGameCensorLog,
    gameCensorLogs,
    fetchGamePriceLogs,
    gamePriceLogs,
  } = useGameStore();
  const [index, setIndex] = useState(-1);
  const { getDefaultPlatforms, fetchPlatforms } = usePlatformStore();
  const { fetchGameFiles, gameFiles, installInstruction } = useGameStore();
  const [isApproving, setIsApproving] = useState(false);
  const [isDeclining, setIsDeclining] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const { profile } = useAuthStore();
  const gameKeys: GameKey[] = [];
  const [keyModalOpen, setKeyModalOpen] = useState(false);
  const { isCopied, copyToClipboard } = useClipboard();

  const handleKeysUpdated = () => {};
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "instant",
    });
  }, []);

  useEffect(() => {
    if (game) {
      fetchPlatforms();
      fetchGameFiles(game.id);
      fetchGameCensorLog(game.id);
      fetchGamePriceLogs(game.id);
    }
  }, [game]);

  useEffect(() => {
    if (gameId) {
      fetchGameById(gameId);
    } else {
      navigate("/admin/manage-games");
    }
  }, [gameId]);

  if (!gameId) {
    return <Navigate to={`/`} />;
  }
  if (loading) {
    return <Loader />;
  }
  if (error) {
    return <GameNotFound darkTheme={false} />;
  }
  if (!game) return;
  const defaultPlatforms = getDefaultPlatforms();
  const infoItems: DescriptionsProps["items"] = [
    {
      key: "game-id",
      label: "Game ID",
      children: (
        <div>
          <span className="me-1">{game.id}</span>
          <Button
            size="small"
            onClick={() => copyToClipboard(game.id)}
            icon={isCopied ? <FaCheck /> : <FaRegCopy />}
            shape="circle"
            type="text"
          />
        </div>
      ),
      span: 2,
    },
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
      label: (
        <div>
          Price <ViewPriceLogButton priceLogs={gamePriceLogs} />
        </div>
      ),
      children: (() => {
        if (!game) return null;

        if (game.price === 0) {
          return "Free";
        }

        const hasDiscount = game.price !== game.priceAfterDiscount;

        if (hasDiscount) {
          return (
            <div>
              <p className="text-green-500 font-semibold">
                {formatCurrencyVND(game.priceAfterDiscount)}
              </p>
              <p className="line-through text-gray-400 text-xs">
                {formatCurrencyVND(game.price)}
              </p>
            </div>
          );
        }

        return formatCurrencyVND(game.price);
      })(),
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
      span: 2,
    });
  }

  const handleViewGamePage = () => {
    navigate(`/game/${game?.id}`);
  };

  const handleApprove = () => {
    if (!profile) return;
    Modal.confirm({
      title: "Approve Game",
      content: `Are you sure you want to approve game "${game.name}"?`,
      okText: "Approve",
      okType: "primary",
      okButtonProps: { icon: <FaCheck /> },
      cancelText: "Cancel",
      onOk: async () => {
        setIsApproving(true);
        if (gameId) {
          const result = await updateGameActivation(
            gameId,
            "Approved",
            profile.id,
            ""
          );
          if (result.success) {
            messageApi.open({
              type: "success",
              content: `Game "${game.name}" approved successfully`,
            });
            fetchGameById(gameId);
          } else {
            messageApi.open({
              type: "error",
              content: result.error || "Failed to approve game",
            });
          }
        }
        setIsApproving(false);
      },
      onCancel() {
        setIsApproving(false);
      },
    });
  };

  const handleDecline = () => {
    if (!profile) return;

    let reason = "";

    Modal.confirm({
      title: "Decline Game",
      content: (
        <Input.TextArea
          rows={4}
          placeholder="Enter reason for rejection"
          onChange={(e) => {
            reason = e.target.value;
          }}
        />
      ),
      okText: "Decline",
      okType: "danger",
      okButtonProps: { icon: <IoMdClose /> },
      cancelText: "Cancel",
      async onOk() {
        if (!reason.trim()) {
          messageApi.error("Please enter a reason before declining.");
          throw new Error("No reason provided");
        }

        setIsDeclining(true);

        if (gameId) {
          const result = await updateGameActivation(
            gameId,
            "Rejected",
            profile.id,
            reason
          );
          if (result.success) {
            messageApi.success(`Game "${game.name}" rejected`);
            fetchGameById(gameId);
          } else {
            messageApi.error(result.error || "Failed to reject game");
          }
        }

        setIsDeclining(false);
      },
      onCancel() {
        setIsDeclining(false);
      },
    });
  };

  return (
    <div>
      {contextHolder}
      <Lightbox
        index={index}
        slides={slides}
        open={index >= 0}
        close={() => setIndex(-1)}
        plugins={[Fullscreen, Slideshow, Thumbnails, Zoom]}
      />
      <h1 className="text-2xl font-bold">
        "{game.name}"{" "}
        <span className="font-normal text-sm">
          by{" "}
          <Link to={`/profile/${game.developer.id}`}>
            {game.developer.userName}
          </Link>
        </span>
      </h1>
      <div className="flex gap-3 justify-end mb-3">
        <Button
          icon={<FaKey />}
          type="primary"
          onClick={() => setKeyModalOpen(true)}
        >
          Game key
        </Button>
        <DeleteGameButton />
        <Button icon={<FaEye />} onClick={handleViewGamePage}>
          View game's page
        </Button>

        {(game.censorStatus === "PendingAIReview" ||
          game.censorStatus === "PendingManualReview") && (
          <>
            <Button
              icon={<IoMdClose />}
              type="primary"
              danger
              onClick={handleDecline}
              loading={isDeclining}
            >
              Decline game
            </Button>
            <Button
              icon={<FaCheck />}
              type="primary"
              style={{ backgroundColor: "green" }}
              onClick={handleApprove}
              loading={isApproving}
            >
              Approve game
            </Button>
          </>
        )}

        {game.censorStatus === "Approved" && (
          <Button
            icon={<IoMdClose />}
            type="primary"
            danger
            onClick={handleDecline}
            loading={isDeclining}
          >
            Decline game
          </Button>
        )}

        {game.censorStatus === "Rejected" && (
          <Button
            icon={<FaCheck />}
            type="primary"
            style={{ backgroundColor: "green" }}
            onClick={handleApprove}
            loading={isApproving}
          >
            Approve game
          </Button>
        )}
      </div>
      <div className="bg-white rounded shadow text-left">
        <div className="grid-cols-2 grid gap-3 p-3">
          <div>
            <h3 className="font-bold mb-2 text-lg">Cover Image</h3>
            <FaultTolerantImage
              src={game?.coverImage}
              alt="game's cover image"
              className="aspect-video object-contain bg-zinc-100 rounded highlight-hover cursor-pointer w-full"
              onClick={() => {
                setIndex(0);
              }}
              darkTheme={false}
            />
          </div>
          <div>
            <h3 className="font-bold mb-2 text-lg">Game screenshots/images</h3>
            <div className="grid grid-cols-2 mt-2 gap-3">
              {game?.gameImages.map((image, index: number) => {
                return (
                  <FaultTolerantImage
                    src={image.image}
                    key={`game-image-${image.id}`}
                    alt=""
                    className="aspect-video object-contain bg-zinc-200 rounded highlight-hover cursor-pointer w-full"
                    onClick={() => {
                      setIndex(index + 1);
                    }}
                    darkTheme={false}
                  />
                );
              })}
            </div>
          </div>
          <div className="col-span-2">
            <h3 className="font-bold mb-2 text-lg">Game information</h3>
            <Descriptions
              column={2}
              bordered
              items={infoItems}
              styles={{
                label: { border: "1px solid #a1a1aa", fontWeight: "bold" },
                content: { border: "1px solid #a1a1aa" },
              }}
            />
          </div>

          <div className="col-span-2">
            <h3 className="font-bold mb-2 text-lg">Gameplay/trailer</h3>
            {game?.videoLink ? (
              <ReactPlayer
                className="react-player"
                url={game?.videoLink}
                controls
              />
            ) : (
              <div className="text-gray-500">None</div>
            )}
          </div>
          <div className="col-span-2">
            <h3 className="font-bold mb-2 text-lg">Description</h3>
            <div className="p-3 border bg-zinc-100 border-zinc-300 rounded">
              <ExpandableWrapper>
                <TiptapView value={game?.description} darkTheme={false} />
              </ExpandableWrapper>
            </div>
          </div>

          <div className="col-span-2">
            <h3 className="font-bold mb-2 text-lg">Game files</h3>

            <div className="grid grid-cols-2 gap-3 mb-1">
              {gameFiles.map((file, index) => {
                return (
                  <FileCard
                    file={file}
                    key={`game-file-${index}`}
                    defaultPlatforms={defaultPlatforms}
                    darkTheme={false}
                  />
                );
              })}
              {!gameFiles && <span className="text-gray-500">None</span>}
            </div>
            <ViewAllVersionButton darkTheme={false} />
          </div>
          <div>
            <h3 className="font-bold mb-2 text-lg">Install Instructions</h3>
            <div className="p-3 border bg-zinc-100 border-zinc-300 rounded">
              {installInstruction ? (
                <ExpandableWrapper>
                  <div className="font-mono">
                    <TiptapView value={installInstruction} darkTheme={false} />
                  </div>
                </ExpandableWrapper>
              ) : (
                <span className="text-gray-500">None</span>
              )}
            </div>
          </div>
          <div>
            <h3 className="font-bold mb-2 text-lg">Version notes</h3>
            <div className="p-3 border bg-zinc-100 border-zinc-300 rounded">
              {game.versionDescription ? (
                <ExpandableWrapper>
                  <div className="font-mono">
                    <TiptapView
                      value={game.versionDescription}
                      darkTheme={false}
                    />
                  </div>
                </ExpandableWrapper>
              ) : (
                <span className="text-gray-500">None</span>
              )}
            </div>
          </div>
        </div>
      </div>
      <ModGameKeyModal
        open={keyModalOpen}
        onClose={() => setKeyModalOpen(false)}
        gameId={game?.id}
        gameKeys={gameKeys}
        onKeysUpdated={handleKeysUpdated}
      />
    </div>
  );
};

export default AdminGameDetail;
