import Loader from "@/components/loader";
import ScrollToTop from "@/components/scroll-to-top";
import useGameStore from "@/store/use-game-store";
import {
  Avatar,
  Button,
  Dropdown,
  MenuProps,
  Rate,
  Tabs,
  TabsProps,
  Tag,
  Tooltip,
} from "antd";
import { useEffect, useState } from "react";
import { CiUser } from "react-icons/ci";
import { FaFlag, FaInfoCircle, FaLink, FaStar } from "react-icons/fa";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import Lightbox from "yet-another-react-lightbox";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Slideshow from "yet-another-react-lightbox/plugins/slideshow";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import MaxWidthWrapper from "@/components/wrappers/max-width-wrapper";
import { IoIosChatboxes, IoMdMore } from "react-icons/io";
import GameOverView from "./game-overview";
import GameReviews from "./game-reviews";
import GameForum from "./game-posts/game-forum";
import FaultTolerantImage from "@/components/fault-tolerant-image";
import useAuthStore from "@/store/use-auth-store";
import GameNotFound from "@/pages/errors/game-not-found";
import usePlatformStore from "@/store/use-platform-store";
import useWishlistStore from "@/store/use-wish-list-store";
import AddToWishlistButton from "@/components/buttons/add-to-wishlist-button";
import { formatDuration } from "@/lib/date-n-time";
import ReportGameModal from "@/components/report-modal/report-game-modal";
import { useHashState } from "@/hooks/use-hash-state";
import useFollowStore from "@/store/use-follow-store";
import { useGlobalMessage } from "@/components/message-provider";

const GameDetailsPage = () => {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const { fetchGameById, loading, error, game } = useGameStore();
  const { fetchPlatforms } = usePlatformStore();
  const { profile } = useAuthStore();
  const { fetchWishlistGameIds } = useWishlistStore();
  const [index, setIndex] = useState(-1);
  const [activeTab, setActiveTab] = useHashState("overview");
  const [reportGameModalOpen, setReportGameModalOpen] = useState(false);
  const {
    followDeveloper,
    checkIsFollowed,
    isFollowed,
    loading: followLoading,
  } = useFollowStore();
  const messageApi = useGlobalMessage();

  const tabItems: TabsProps["items"] = [
    {
      key: "overview",
      label: (
        <div className="flex gap-2 items-center font-semibold">
          <FaInfoCircle />
          Overview
        </div>
      ),
      children: <GameOverView />,
    },
    {
      key: "reviews",
      label: (
        <div className="flex gap-2 items-center font-semibold">
          <FaStar />
          Reviews
        </div>
      ),
      children: <GameReviews />,
    },
    {
      key: "forum",
      label: (
        <div className="flex gap-2 items-center font-semibold">
          <IoIosChatboxes />
          Forum
        </div>
      ),
      children: <GameForum />,
    },
  ];

  const devProfileItems: MenuProps["items"] = [
    {
      label: <div>Copy link to user</div>,
      icon: <FaLink />,
      key: "0",
    },
    {
      label: <div>Report user</div>,
      key: "1",
      icon: <FaFlag />,
      disabled: profile?.id === game?.developer.id,
    },
  ];
  useEffect(() => {
    const checkFollow = async () => {
      if (profile?.id && game?.developer?.id) {
        await checkIsFollowed(profile.id, game.developer.id);
      }
    };

    checkFollow();
  }, [profile?.id, game?.developer?.id]);

  useEffect(() => {
    if (profile) {
      fetchWishlistGameIds(profile.id);
    }
  }, [profile]);

  useEffect(() => {
    if (gameId) {
      fetchPlatforms();
      fetchGameById(gameId);
    } else {
      navigate("/");
    }
  }, [gameId, fetchGameById, fetchPlatforms, navigate]);
  const handleFollowClick = async () => {
    if (!profile?.id) {
      messageApi.error("Please login to follow developers");
      return;
    }
    if (!game?.developer?.id) return;

    await followDeveloper(profile.id, game.developer.id);
  };

  if (!gameId) {
    return <Navigate to={`/`} />;
  }
  if (loading) {
    return <Loader />;
  }
  if (!game) return null;

  if (error || game.censorStatus != "Approved" || game.visibility != "Public") {
    return <GameNotFound />;
  }

  const slides = [
    { src: game.coverImage },
    ...game.gameImages.map((image) => ({ src: image.image })),
  ];

  return (
    <MaxWidthWrapper className="py-5">
      <ScrollToTop />
      <div className="grid grid-cols-2 gap-3 bg-zinc-900">
        {/* GAME COVER IMAGE */}
        {game.coverImage ? (
          <FaultTolerantImage
            src={game.coverImage}
            alt="game cover image"
            className="aspect-video object-contain rounded h-full highlight-hover cursor-pointer bg-zinc-950"
            onClick={() => setIndex(0)}
          />
        ) : (
          <div className="aspect-video"></div>
        )}
        {/* GAME METADATA */}
        <div className="flex flex-col gap-2 bg-zinc-800 rounded p-3">
          <div>
            <div className="flex">
              <h2 className="text-3xl font-bold flex-1">{game.name}</h2>
              <div className="flex gap-2">
                <Tooltip title="Copy link to game">
                  <Button shape="circle" icon={<FaLink />}></Button>
                </Tooltip>
                <Tooltip title="Report game">
                  <Button
                    shape="circle"
                    icon={<FaFlag />}
                    onClick={() => setReportGameModalOpen(true)}
                  ></Button>
                </Tooltip>

                <ReportGameModal
                  open={reportGameModalOpen}
                  onClose={() => setReportGameModalOpen(false)}
                  gameId={game?.id || ""}
                />
                <AddToWishlistButton game={game} />
              </div>
            </div>
            <p className="text-zinc-400">{game.shortDescription}</p>
            <Link
              to={`/search?category=${game.category.id}`}
              className="font-semibold text-orange-200 hover:underline"
            >
              {game.category?.name}
            </Link>
          </div>
          {/* DEVELOPER INFORMATION */}
          <div className="my-2 flex gap-3 items-center justify-between bg-zinc-900 drop-shadow rounded-lg p-2">
            <Link
              to={`/profile/${game.developer.id}#games`}
              className="flex items-center gap-3"
            >
              {game.developer.avatar ? (
                <Avatar src={game.developer.avatar} />
              ) : (
                <Avatar icon={<CiUser />} />
              )}
              <p className="font-semibold">{game.developer.userName}</p>
            </Link>
            <div>
              <Button
                style={{ width: 150 }}
                type={isFollowed ? "default" : "primary"}
                onClick={handleFollowClick}
                loading={followLoading}
                disabled={profile?.id === game.developer.id}
              >
                {isFollowed ? "Following" : "Follow"}
              </Button>
              <Dropdown menu={{ items: devProfileItems }} trigger={["click"]}>
                <Button icon={<IoMdMore />}></Button>
              </Dropdown>
            </div>
          </div>
          <div className="flex gap-1 text-sm items-end">
            <span className="uppercase text-zinc-400 text-xs">Tags:</span>
            {game.gameTags.map((tag, index: number) => (
              <Link key={`game-tag-${index}`} to={`/search?tags=${tag.tag.id}`}>
                <Tag color="orange">{tag.tag.name}</Tag>
              </Link>
            ))}
          </div>
          <div className="flex gap-2 text-sm items-end">
            <span className="uppercase text-zinc-400 text-xs">Languages:</span>
            {game.gameLanguages.map((language, index: number) => (
              <span className="text-orange-200" key={`game-language-${index}`}>
                {language.language.name}{" "}
                {index !== game.gameLanguages.length - 1 && ", "}
              </span>
            ))}
          </div>
          <div className="flex gap-2 text-sm items-end">
            <span className="uppercase text-zinc-400 text-xs">
              Average time:
            </span>
            <span>{formatDuration(game.averageSession)}</span>
          </div>
          <hr className="border-zinc-700 my-3"/>
          <div className="gap-2 text-sm">
            <p className="uppercase text-zinc-400 text-xs">Average rating:</p>
            {game.numberOfReviews > 0 ? (
              <div>
                <p className="text-2xl">
                  {game.averageRating.toFixed(1)}
                  <span className="text-sm text-zinc-400">
                    {" "}
                    ({game.numberOfReviews} reviews)
                  </span>
                </p>
                <Rate
                  disabled
                  defaultValue={game.averageRating}
                  style={{ fontSize: 16 }}
                />
              </div>
            ) : (
              <p className="text-zinc-400">No rating</p>
            )}
          </div>
        </div>
      </div>
      <Lightbox
        index={index}
        slides={slides}
        open={index >= 0}
        close={() => setIndex(-1)}
        plugins={[Fullscreen, Slideshow, Thumbnails, Zoom]}
      />
      {/* GAME IMAGES/SCREENSHOT */}
      <div className="flex overflow-auto gap-3 p-3 bg-zinc-900">
        {game.gameImages.map((image, index: number) => (
          <FaultTolerantImage
            key={`game-image-${index}`}
            src={image.image}
            className="aspect-16/9 w-40 rounded object-contain highlight-hover cursor-pointer"
            onClick={() => setIndex(index + 1)}
          />
        ))}
      </div>
      {/* TABS */}
      <div className="px-5 bg-zinc-900 rounded mt-2 pb-5">
        <Tabs
          defaultActiveKey={activeTab}
          items={tabItems}
          onChange={(key) => {
            setActiveTab(key);
          }}
        />
      </div>
    </MaxWidthWrapper>
  );
};

export default GameDetailsPage;
