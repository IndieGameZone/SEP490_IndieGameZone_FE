import TiptapView from "@/components/tiptap/tiptap-view";
import { formatCurrencyVND } from "@/lib/currency";
import { formatDate } from "@/lib/date";
import useGameStore from "@/store/use-game-store";
import usePlatformStore from "@/store/use-platform-store";
import { Button } from "antd";
import {
  FaApple,
  FaDownload,
  FaFileArchive,
  FaLinux,
  FaShoppingCart,
  FaWindows,
} from "react-icons/fa";
import ReactPlayer from "react-player";
import { GAME_REALEASE_STATUS } from "@/constants/game";

const GameOverView = () => {
  const { game } = useGameStore();
  const { getDefaultPlatforms } = usePlatformStore();

  if (!game) return;
  const defaultPlatforms = getDefaultPlatforms();

  const releaseStatus = GAME_REALEASE_STATUS.find(
    (x) => x.value == game.status
  )?.label;
  return (
    <div className="grid grid-cols-12 gap-2">
      <div className="col-span-8 bg-zinc-900">
        <div className="bg-zinc-800 p-5 border border-zinc-800 rounded">
          {game.videoLink && (
            <>
              <h3 className="text-xl font-bold my-2">Gameplay/Trailer</h3>
              <ReactPlayer
                className="react-player"
                url={game.videoLink}
                width="100%"
                controls
              />
            </>
          )}

          <h3 className="text-xl font-bold my-2">Description</h3>
          {game.description ? (
            <TiptapView value={game.description} />
          ) : (
            <p className="text-zinc-400">No description</p>
          )}
          <hr className="mt-10 mb-5 border-zinc-700" />
          <div className="flex justify-between">
            <div>
              <table>
                <tbody>
                  <tr>
                    <td className="pe-5">Release status</td>
                    <td className="font-semibold text-orange-200">
                      {releaseStatus}
                    </td>
                  </tr>
                  <tr>
                    <td className="pe-5">Released on</td>
                    <td className="font-semibold">{formatDate(new Date(game.createdAt))}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="border border-zinc-700 rounded flex w-60 overflow-hidden">
              <div className="bg-orange-900 py-3 px-5 text-2xl font-bold text-center text-orange-200 border-e border-zinc-700">
                {game.ageRestriction.code}
              </div>
              <p className="text-xs p-3 bg-zinc-900 font-semibold text-zinc-300">
                {game.ageRestriction.description}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="col-span-4">
        <div className="bg-zinc-800 rounded">
          <h1 className="px-5 pt-5 font-semibold text-xl">Download Game</h1>
          <div className="px-5 pt-2 pb-5 border-b border-zinc-800 ">
            <div className="flex gap-3 items-center">
              {game.price == 0 ? (
                <>
                  <Button size="large" type="primary" icon={<FaDownload />}>
                    Download Now
                  </Button>
                  <p className="mt-1 text-gray-500 text-sm">For Free</p>
                </>
              ) : (
                <>
                  <Button size="large" type="primary" icon={<FaShoppingCart />}>
                    Buy Now
                  </Button>
                  <p className="mt-1 text-xl">
                    {formatCurrencyVND(game.price)}
                  </p>
                </>
              )}
            </div>
            {game.price > 0 && (
              <>
                <p className="my-2">
                  You will get access to the following files:
                </p>
                <div className="flex flex-col gap-2">
                  {game.gamePlatforms?.map((file, index) => {
                    return (
                      <div
                        key={`game-file-${index}`}
                        className="flex gap-2 items-center p-2 bg-zinc-800 rounded"
                      >
                        {file.platform.id ==
                        defaultPlatforms.windowsPlatformId ? (
                          <FaWindows />
                        ) : file.platform.id ==
                          defaultPlatforms.macOsPlatformId ? (
                          <FaApple />
                        ) : file.platform.id ==
                          defaultPlatforms.linuxPlatformId ? (
                          <FaLinux />
                        ) : (
                          <FaFileArchive />
                        )}
                        <span className="font-semibold max-w-50 text-ellipsis overflow-clip">
                          {file.displayName ? file.displayName : "unnamed file"}
                        </span>
                        <span className="text-sm text-zinc-400">
                          ({(file.size / 1024 / 1024).toFixed(1)} MB)
                        </span>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameOverView;
