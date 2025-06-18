import Loader from "@/components/loader";
import ScrollToTop from "@/components/scroll-to-top";
import useGameStore from "@/store/use-game-store";
import {
  Avatar,
  Button,
  Dropdown,
  MenuProps,
  Tabs,
  TabsProps,
  Tag,
  Tooltip,
} from "antd";
import { useEffect, useState } from "react";
import { CiUser } from "react-icons/ci";
import { FaFlag, FaInfoCircle, FaLink, FaStar } from "react-icons/fa";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import Lightbox from "yet-another-react-lightbox";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Slideshow from "yet-another-react-lightbox/plugins/slideshow";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import MaxWidthWrapper from "@/components/max-width-wrapper";
import devAvatar from "@/assets/mock/dev-avatar.webp";
import { IoIosChatboxes, IoMdMore } from "react-icons/io";
import GameOverView from "./game-overview";
import GameReviews from "./game-reviews";
import GameForum from "./game-forum";

const GameDetailsPage = () => {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const { fetchGameById, loading, error, game } = useGameStore();
  const [index, setIndex] = useState(-1);

  const tabItems: TabsProps["items"] = [
    {
      key: "overview-tab",
      label: (
        <div className="flex gap-2 items-center font-semibold">
          <FaInfoCircle />
          Overview
        </div>
      ),
      children: <GameOverView />,
    },
    {
      key: "reviews-tab",
      label: (
        <div className="flex gap-2 items-center font-semibold">
          <FaStar />
          Reviews
        </div>
      ),
      children: <GameReviews />,
    },
    {
      key: "forum-tab",
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
    },
  ];

  useEffect(() => {
    if (gameId) {
      fetchGameById(gameId);
    } else {
      navigate("/");
    }
  }, []);

  if (!gameId) {
    return <Navigate to={`/`} />;
  }
  if (loading) {
    return <Loader />;
  }
  if (error) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="bg-zinc-800 shadow-xl rounded-2xl p-8 max-w-md text-center border border-orange-500">
          <h1 className="text-3xl font-bold text-red-600 mb-4">
            Game Not Found
          </h1>
          <p className="mb-6">We couldn't find the game you're looking for.</p>
          <Button onClick={() => navigate(-1)}>Go Back</Button>
        </div>
      </div>
    );
  }
  if (!game) return;
  const slides = [
    { src: game.coverImage },
    ...game.gameImages.map((image) => ({ src: image.image })),
  ];
  return (
    <MaxWidthWrapper className="py-5">
      <ScrollToTop />
      <div className="grid grid-cols-3 gap-3 bg-zinc-900">
        {game?.coverImage ? (
          <img
            src={game.coverImage}
            alt="game cover image"
            className="aspect-4/3 object-cover rounded w-full highlight-hover cursor-pointer"
            onClick={() => setIndex(0)}
          />
        ) : (
          <div></div>
        )}
        <div className="col-span-2 flex flex-col gap-2 bg-zinc-800 rounded p-3">
          <div>
            <div className="flex">
              <h2 className="text-3xl font-bold flex-1">{game?.name}</h2>
              <div className="flex gap-2">
                <Tooltip title="Copy link to game">
                  <Button shape="circle" icon={<FaLink />}></Button>
                </Tooltip>
                <Tooltip title="Report user">
                  <Button shape="circle" icon={<FaFlag />}></Button>
                </Tooltip>
              </div>
            </div>
            <p className="text-zinc-500">{game?.shortDescription}</p>
            <span className="font-semibold text-orange-200">
              {game?.category?.name}
            </span>
          </div>

          <div className="my-2 flex gap-3 items-center justify-between bg-zinc-900 drop-shadow rounded-lg p-2">
            <div className="flex items-center gap-3">
              {devAvatar ? (
                <Avatar src={devAvatar} />
              ) : (
                <Avatar icon={<CiUser />} />
              )}
              <p className="font-semibold">Username</p>
            </div>

            <div>
              <Button style={{ width: 150 }}>Follow</Button>
              <Dropdown menu={{ items: devProfileItems }}>
                <Button icon={<IoMdMore />}></Button>
              </Dropdown>
            </div>
          </div>
          <div className="flex gap-2 text-sm items-end">
            <span className="uppercase text-zinc-400 text-xs">Tags:</span>
            {game?.gameTags.map((tag, index: number) => (
              <Tag key={`game-tag-${index}`} color="orange">
                {tag.tag.name}
              </Tag>
            ))}
          </div>
          <div className="flex gap-2 text-sm items-end">
            <span className="uppercase text-zinc-400 text-xs">Languages:</span>
            {game?.gameLanguages.map((language, index: number) => (
              <span className="text-orange-200" key={`game-language-${index}`}>
                {language.language.name}{" "}
                {index != game.gameLanguages.length - 1 && ", "}
              </span>
            ))}
          </div>
          <div className="flex gap-2 text-sm items-end">
            <span className="uppercase text-zinc-400 text-xs">
              Average time:
            </span>
            <span>{game?.averageSession} Minutes</span>
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
      <div className="flex overflow-auto gap-3 p-3 bg-zinc-900">
        {game.gameImages.map((image, index: number) => (
          <img
            key={`game-image-${index}`}
            src={image.image}
            className="aspect-16/9 w-40 rounded highlight-hover cursor-pointer"
            onClick={() => setIndex(index + 1)}
          />
        ))}
      </div>
      <div className="px-5 bg-zinc-900 rounded mt-2 pb-5">
        <Tabs defaultActiveKey="overview-tab" items={tabItems} />
      </div>
    </MaxWidthWrapper>
  );
};

export default GameDetailsPage;
