import { formatMegabytes } from "@/lib/file";
import { GameFile } from "@/types/game";
import { Tooltip } from "antd";
import { FaApple, FaFileArchive, FaLinux, FaWindows } from "react-icons/fa";
import DownloadFileButton from "./download-file-button";

const FileCard = ({
  file,
  defaultPlatforms,
  darkTheme = true,
}: {
  file: GameFile;
  defaultPlatforms: any;
  darkTheme?: boolean;
}) => {
  return (
    <div
      className={`flex justify-between p-2 ${
        darkTheme
          ? "bg-zinc-900 border-zinc-700"
          : "bg-zinc-100 border-zinc-300"
      } rounded border `}
    >
      <div className="flex gap-2 items-center flex-1">
        {file.platform.id == defaultPlatforms.windowsPlatformId ? (
          <FaWindows />
        ) : file.platform.id == defaultPlatforms.macOsPlatformId ? (
          <FaApple />
        ) : file.platform.id == defaultPlatforms.linuxPlatformId ? (
          <FaLinux />
        ) : (
          <FaFileArchive />
        )}
        <span className="font-semibold max-w-44 text-ellipsis overflow-clip">
          {file.displayName ? file.displayName : "unnamed file"}
        </span>
        <span className="text-sm text-zinc-400">
          ({formatMegabytes(file.size)})
        </span>
      </div>
      <Tooltip
        title={`Download ${
          file.displayName ? file.displayName : "unnamed file"
        }`}
      >
        <DownloadFileButton file={file} />
      </Tooltip>
    </div>
  );
};

export default FileCard;
