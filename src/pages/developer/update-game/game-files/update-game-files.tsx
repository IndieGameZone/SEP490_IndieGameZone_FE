import useGameStore from "@/store/use-game-store";
import { Table } from "antd";
import { columns } from "./columns";
import { GameFile } from "@/types/game";
import TiptapView from "@/components/tiptap/tiptap-view";
import UpdateInstallInstructionButton from "./update-install-instruction-button";
import UploadNewFileButton from "./upload-new-file-button";
import UpdateVersionDescription from "./update-version-description-button";

const UpdateGameFiles = () => {
  const { loadingFiles, gameFiles, installInstruction, game } = useGameStore();
  return (
    <div className="p-5 bg-zinc-900">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-2xl mb-3">Game Files</h2>
        <UploadNewFileButton />
      </div>
      <Table<GameFile>
        columns={columns}
        dataSource={gameFiles}
        loading={loadingFiles}
        rowKey={"id"}
        scroll={{ x: "max-content" }}
      />
      <hr className="my-3 border-zinc-700" />

      <div className="flex justify-between mb-2 items-center">
        <h2 className="font-bold">Version notes</h2>
        <UpdateVersionDescription />
      </div>

      <div className="rounded bg-zinc-800 p-3 border border-zinc-700">
        {game?.versionDescription ? (
          <div className="font-mono">
            <TiptapView value={game.versionDescription} />
          </div>
        ) : (
          <span className="text-zinc-500">None</span>
        )}
      </div>
      <hr className="my-3 border-zinc-700" />
      <div className="flex justify-between mb-2 mt-5 items-center">
        <h2 className="font-bold">Install instructions</h2>
        <UpdateInstallInstructionButton />
      </div>
      <div className="rounded bg-zinc-800 p-3 border border-zinc-700">
        {installInstruction ? (
          <div className="font-mono">
            <TiptapView value={installInstruction} />
          </div>
        ) : (
          <span className="text-gray-500">None</span>
        )}
      </div>
    </div>
  );
};

export default UpdateGameFiles;
