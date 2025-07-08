import { formatMegabytes } from "@/lib/file";
import { GameFile } from "@/types/game";
import { Button, Tooltip } from "antd";
import {
  FaApple,
  FaDownload,
  FaFileArchive,
  FaLinux,
  FaWindows,
} from "react-icons/fa";

const FileCard = ({
  file,
  defaultPlatforms,
  darkTheme = true,
}: {
  file: GameFile;
  defaultPlatforms: any;
  darkTheme?: boolean;
}) => {
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = file.file;
    link.download = file.displayName || "";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
        <Button shape="circle" icon={<FaDownload />} onClick={handleDownload} />
      </Tooltip>
    </div>
  );
};

export default FileCard;
