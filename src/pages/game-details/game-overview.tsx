import TiptapView from "@/components/tiptap/tiptap-view";
import { formatCurrencyVND } from "@/lib/currency";
import { formatDate } from "@/lib/date-n-time";
import useGameStore from "@/store/use-game-store";
import usePlatformStore from "@/store/use-platform-store";
import { FaApple, FaFileArchive, FaLinux, FaWindows } from "react-icons/fa";
import ReactPlayer from "react-player";
import { GAME_REALEASE_STATUS } from "@/constants/game";
import DownloadGameButton from "./download-game-button";
import BuyGameButton from "./buy-game-button";
import { useEffect, useState } from "react";
import useLibraryStore from "@/store/use-library-store";
import useAuthStore from "@/store/use-auth-store";
import { Tooltip } from "antd";
import { formatMegabytes } from "@/lib/file";

const GameOverView = () => {
  const { game } = useGameStore();
  const { getDefaultPlatforms } = usePlatformStore();
  const { ownedGameIds, fetchOwnedGameIds } = useLibraryStore();
  const [isGameOwned, setIsGameOwned] = useState(false);
  const [developerTooltip, setDeveloperTooltip] = useState<string | undefined>(
    undefined
  );
  const { profile } = useAuthStore();

  useEffect(() => {
    if (profile) {
      fetchOwnedGameIds(profile.id);
    }
  }, [profile]);

  useEffect(() => {
    if (profile && game && profile.id == game.developer.id) {
      setDeveloperTooltip("You are developer of this game!");
    }
  }, [profile, game]);

  useEffect(() => {
    if (ownedGameIds.length && game) {
      setIsGameOwned(ownedGameIds.includes(game.id));
    }
  }, [ownedGameIds, game]);

  if (!game) return;
  const defaultPlatforms = getDefaultPlatforms();

  // This is bad practice, may change in the future to map value - label
  const releaseStatus = GAME_REALEASE_STATUS.find(
    (x) => x.value == game.status
  )?.label;

  const activeFiles = game.gamePlatforms.filter((x) => x.isActive);

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
                    <td className="font-semibold">
                      {formatDate(new Date(game.createdAt))}
                    </td>
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
      {/* DISLAY DOWNLOAD/PURCHASE BUTTON */}
      <div className="col-span-4">
        <div className="bg-zinc-800 rounded">
          <h1 className="px-5 pt-5 font-semibold text-xl">Download Game</h1>
          <div className="px-5 pt-2 pb-5 border-b border-zinc-800 ">
            <Tooltip title={developerTooltip}>
              <div className="flex gap-3 items-center">
                {game.price == 0 || isGameOwned ? (
                  <>
                    <DownloadGameButton isGameOwned={isGameOwned} />
                    <p className="mt-1 text-gray-500 text-sm">
                      {isGameOwned ? "Purchased" : "For free"}
                    </p>
                  </>
                ) : (
                  <>
                    <BuyGameButton />
                    <p className="mt-1 text-xl">
                      {formatCurrencyVND(game.price)}
                    </p>
                  </>
                )}
              </div>
            </Tooltip>
            {/* DISPLAYED INCLUDED FILES */}
            {game.price > 0 && !isGameOwned && activeFiles.length > 0 && (
              <>
                <p className="my-2">
                  You will get access to the following files:
                </p>
                <div className="flex flex-col gap-2">
                  {activeFiles?.map((file, index) => {
                    return (
                      <div
                        key={`game-file-${index}`}
                        className="flex gap-2 items-center bg-zinc-800 rounded"
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
                        <span className="font-semibold">
                          {file.displayName ? file.displayName : "unnamed file"}
                          {" "}
                          <span className="text-sm text-zinc-400">
                            ({formatMegabytes(file.size)})
                          </span>
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
