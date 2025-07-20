import { formatMegabytes } from "@/lib/file";
import { GameFile } from "@/types/game";
import { Tooltip } from "antd";
import { FaApple, FaFileArchive, FaLinux, FaWindows } from "react-icons/fa";
import DownloadFileButton from "./buttons/download-file-button";

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
      className={`flex justify-between p-2 gap-1 ${
        darkTheme
          ? "bg-zinc-900 border-zinc-700"
          : "bg-zinc-100 border-zinc-300"
      } rounded border `}
    >
      <div className="flex gap-2 items-center flex-1">
        <div>
          {file.platform.id == defaultPlatforms.windowsPlatformId ? (
            <FaWindows />
          ) : file.platform.id == defaultPlatforms.macOsPlatformId ? (
            <FaApple />
          ) : file.platform.id == defaultPlatforms.linuxPlatformId ? (
            <FaLinux />
          ) : (
            <FaFileArchive />
          )}
        </div>

        <div className="font-semibold text-ellipsis overflow-clip">
          {file.displayName ? file.displayName : "unnamed file"}{" "}
          <span className="text-sm text-zinc-400 min-w-14">
            ({formatMegabytes(file.size)})
          </span>
        </div>
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
