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
}: {
  file: GameFile;
  defaultPlatforms: any;
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
    <div className="flex justify-between p-2 bg-zinc-900 rounded border border-zinc-700">
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
          ({(file.size / 1024 / 1024).toFixed(1)} MB)
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
