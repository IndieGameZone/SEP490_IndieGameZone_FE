import Loader from "@/components/loader";
import TiptapView from "@/components/tiptap/tiptap-view";
import useGameStore from "@/store/use-game-store";
import { useEffect } from "react";
import { Link, Navigate, useParams } from "react-router-dom";

const DownloadGamePage = () => {
  const { gameId } = useParams();
  const {
    fetchGameById,
    game,
    loading,
    fetchGameFiles,
    loadingFiles,
    installInstruction,
  } = useGameStore();
  useEffect(() => {
    if (gameId) {
      fetchGameById(gameId);
    }
  }, []);

  useEffect(() => {
    if (game && game.price == 0) {
      fetchGameFiles(game.id);
    }
  }, [game]);

  if (!gameId) {
    return <Navigate to={"/"} />;
  }
  if (!game) return;
  if (loading || loadingFiles) return <Loader />;
  return (
    <div>
      Thanks for downloading {game.name} by {game.developer.userName}. You can
      find more from the same creator on their page:{" "}
      <Link to={`/profile/${game.developer.id}?v=game`}>
        <span className="font-semibold text-orange-500">
          {game.developer.userName}
        </span>
      </Link>
      .
      <br />
      {installInstruction && (
        <div>
          <TiptapView value={installInstruction} />
        </div>
      )}
    </div>
  );
};

export default DownloadGamePage;
