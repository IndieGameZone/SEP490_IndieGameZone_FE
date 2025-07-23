import { useEffect, useCallback, useMemo, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { Button } from "antd";
import { FaArrowLeft } from "react-icons/fa";

import Loader from "@/components/loader";
import MaxWidthWrapper from "@/components/wrappers/max-width-wrapper";
import TiptapView from "@/components/tiptap/tiptap-view";
import DownloadCard from "./download-card";

import useGameStore from "@/store/use-game-store";
import usePlatformStore from "@/store/use-platform-store";
import useAuthStore from "@/store/use-auth-store";
import useLibraryStore from "@/store/use-library-store";
import { Game, GameFile } from "@/types/game";
import ViewAllVersionButton from "./view-all-versions-button";

const DownloadGamePage = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const [isReady, setIsReady] = useState(false);
  const navigate = useNavigate();

  // Store hooks
  const { profile } = useAuthStore();
  const {
    ownedGameIds,
    fetchOwnedGameIds,
    loading: loadingLibrary,
  } = useLibraryStore();
  const {
    fetchGameById,
    game,
    loading: loadingGame,
    fetchGameFiles,
    loadingFiles,
    installInstruction,
    gameFiles,
  } = useGameStore();
  const { fetchPlatforms, getDefaultPlatforms, platforms } = usePlatformStore();

  // Memoized values
  const defaultPlatforms = useMemo(() => getDefaultPlatforms(), [platforms]);
  const isLoading = useMemo(
    () => loadingGame || loadingFiles || loadingLibrary,
    [loadingGame, loadingFiles, loadingLibrary]
  );
  const isFreeGame = useMemo(() => game?.price === 0, [game?.price]);
  const isPaidGame = useMemo(() => game && game.price > 0, [game?.price]);
  const isGameOwned = useMemo(
    () => (game ? ownedGameIds.includes(game.id) : false),
    [ownedGameIds, game?.id]
  );

  const handleBackToGamePage = useCallback(() => {
    navigate(`/game/${gameId}`);
  }, [navigate, gameId]);

  const fetchGameData = useCallback(() => {
    if (!game?.id) return;
    fetchGameFiles(game.id);
    fetchPlatforms();
    setIsReady(true);
  }, [game?.id, fetchGameFiles, fetchPlatforms]);

  // Effects
  useEffect(() => {
    if (profile?.id) {
      fetchOwnedGameIds(profile.id);
    }
  }, [profile?.id, fetchOwnedGameIds]);

  useEffect(() => {
    if (gameId) {
      fetchGameById(gameId);
    }
  }, [gameId, fetchGameById]);

  useEffect(() => {
    if (isFreeGame) {
      fetchGameData();
    }
  }, [isFreeGame, fetchGameData]);

  useEffect(() => {
    if (isPaidGame && !loadingLibrary) {
      if (!isGameOwned) {
        navigate(`/game/${gameId}`);
      } else {
        fetchGameData();
      }
    }
  }, [
    isPaidGame,
    loadingLibrary,
    isGameOwned,
    navigate,
    gameId,
    fetchGameData,
  ]);

  const activeFiles = useMemo(() => {
    return gameFiles.filter((x) => x.isActive);
  }, [gameFiles]);

  if (!gameId) {
    return <Navigate to="/" replace />;
  }

  if (!game || isLoading) {
    return <Loader />;
  }

  if (isReady)
    return (
      <MaxWidthWrapper className="py-10">
        <div className="bg-zinc-900 border border-zinc-700 rounded">
          <GameHeader gameName={game.name} />
          <BackButton onBack={handleBackToGamePage} />
          <GameContent
            game={game}
            gameFiles={activeFiles}
            defaultPlatforms={defaultPlatforms as any}
          />
          {installInstruction && (
            <InstallInstructions
              instruction={installInstruction}
              developerName={game.developer.userName}
              versionNotes={game.versionDescription}
            />
          )}
        </div>
      </MaxWidthWrapper>
    );
};

const GameHeader = ({ gameName }: { gameName: string }) => (
  <div className="p-5 border border-zinc-700">
    <h1 className="font-bold text-xl">Download "{gameName}"</h1>
  </div>
);

const BackButton = ({ onBack }: { onBack: () => void }) => (
  <div className="px-5 bg-zinc-800">
    <Button
      type="text"
      size="large"
      style={{ paddingInline: "1.25rem" }}
      icon={<FaArrowLeft />}
      onClick={onBack}
    >
      Game page
    </Button>
  </div>
);

interface GameContentProps {
  game: Game;
  gameFiles: GameFile[];
  defaultPlatforms: any[];
}

const GameContent = ({
  game,
  gameFiles,
  defaultPlatforms,
}: GameContentProps) => (
  <div className="p-5">
    <div className="text-2xl mb-4">
      <span>
        Thanks for downloading "{game.name}" by {game.developer.userName}.
      </span>
      <br />
      <span>
        You can find more from the same creator on their page:{" "}
        <Link to={`/profile/${game.developer.id}?v=game`}>
          <span className="text-orange-500 hover:underline">
            {game.developer.userName}
          </span>
        </Link>
        .
      </span>
    </div>

    <div className="mt-5 space-y-4">
      {gameFiles
        .filter((x) => x.isActive)
        .map((file, index) => (
          <DownloadCard
            file={file}
            key={`download-card-${file.id || index}`}
            defaultPlatforms={defaultPlatforms}
          />
        ))}
    </div>
    <ViewAllVersionButton />
  </div>
);

interface InstallInstructionsProps {
  instruction: string;
  versionNotes: string;
  developerName: string;
}

const InstallInstructions = ({
  instruction,
  versionNotes,
  developerName,
}: InstallInstructionsProps) => (
  <div className="p-5 border-y border-zinc-700 grid grid-cols-2 gap-3">
    <div>
      <p className="text-sm font-bold mb-2">
        Download and install instructions from {developerName}:
      </p>
      <div className="p-3 bg-zinc-800 font-mono">
        {instruction ? (
          <TiptapView value={instruction} />
        ) : (
          <span className="text-gray-500">None</span>
        )}
      </div>
    </div>
    <div>
      <p className="text-sm font-bold mb-2">Version notes</p>
      <div className="p-3 bg-zinc-800 font-mono">
        {versionNotes ? (
          <TiptapView value={versionNotes} />
        ) : (
          <span className="text-gray-500">None</span>
        )}
      </div>
    </div>
  </div>
);

export default DownloadGamePage;
