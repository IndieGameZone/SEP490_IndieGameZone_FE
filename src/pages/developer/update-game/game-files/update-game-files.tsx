import useGameStore from "@/store/use-game-store";
import { Table } from "antd";
import { columns } from "./columns";
import { GameFile } from "@/types/game";

const UpdateGameFiles = () => {
  const { loadingFiles, gameFiles } = useGameStore();
  return (
    <div className="p-5 bg-zinc-900">
      <h2 className="text-2xl mb-3">Game Files</h2>
      <Table<GameFile> columns={columns} dataSource={gameFiles} loading={loadingFiles}/>
    </div>
  );
};

export default UpdateGameFiles;
