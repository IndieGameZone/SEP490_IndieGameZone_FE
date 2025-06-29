import Loader from "@/components/loader";
import MaxWidthWrapper from "@/components/max-width-wrapper";
import TiptapView from "@/components/tiptap/tiptap-view";
import useGameStore from "@/store/use-game-store";
import { Button } from "antd";
import { useEffect } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { Link, Navigate, useParams } from "react-router-dom";
import DownloadCard from "./download-card";
import usePlatformStore from "@/store/use-platform-store";

const DownloadGamePage = () => {
  const { gameId } = useParams();
  const {
    fetchGameById,
    game,
    loading,
    fetchGameFiles,
    loadingFiles,
    installInstruction,
    gameFiles,
  } = useGameStore();
  const { fetchPlatforms, getDefaultPlatforms } = usePlatformStore();
  useEffect(() => {
    if (gameId) {
      fetchGameById(gameId);
    }
  }, []);

  useEffect(() => {
    if (game && game.price == 0) {
      fetchGameFiles(game.id);
      fetchPlatforms();
    }
  }, [game]);

  if (!gameId) {
    return <Navigate to={"/"} />;
  }
  if (!game) return;
  if (game.price > 0) {
    return <Navigate to={`/game/${game.id}`} />;
  }
  if (loading || loadingFiles) return <Loader />;
  const defaultPlatforms = getDefaultPlatforms();
  return (
    <MaxWidthWrapper className="py-10">
      <div className="bg-zinc-900 border border-zinc-700 rounded">
        <div className="p-5 border border-zinc-700">
          <h1 className="font-bold text-xl">Download "{game.name}"</h1>
        </div>
        <div className="px-5 bg-zinc-800">
          <Button
            type="text"
            size="large"
            style={{ paddingInline: "1.25rem" }}
            icon={<FaArrowLeft />}
          >
            Game page
          </Button>
        </div>
        <div className="p-5">
          <span className="text-2xl">
            Thanks for downloading "{game.name}" by {game.developer.userName}.
          </span>
          <br />
          You can find more from the same creator on their page:{" "}
          <Link to={`/profile/${game.developer.id}?v=game`}>
            <span className="text-orange-500 hover:underline">
              {game.developer.userName}
            </span>
          </Link>
          .
          <br />
          <div className="mt-5">
            {gameFiles.map((x, index: number) => (
              <DownloadCard
                file={x}
                key={`download-card-${index}`}
                defaultPlatforms={defaultPlatforms}
              />
            ))}
          </div>
        </div>
        {installInstruction && (
          <div className="p-5 border-y border-zinc-700">
            <p className="text-sm font-bold">
              Download and install instructions from {game.developer.userName}:
            </p>
            <div className="p-3 bg-zinc-800 mt-2 font-mono">
              <TiptapView value={installInstruction} />
            </div>
          </div>
        )}
      </div>
    </MaxWidthWrapper>
  );
};

export default DownloadGamePage;
