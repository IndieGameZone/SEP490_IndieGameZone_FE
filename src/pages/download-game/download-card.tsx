import { timeAgo } from "@/lib/date-n-time";
import { GameFile } from "@/types/game";
import { Button, Tooltip } from "antd";
import {
  FaApple,
  FaDownload,
  FaFileArchive,
  FaLinux,
  FaRegClock,
  FaWindows,
} from "react-icons/fa";

const DownloadCard = ({
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
    <div
      className={`flex p-2 bg-zinc-900 border-zinc-700 rounded border gap-3 mb-2 items-center`}
    >
      <Button
        type="primary"
        icon={
          file.platform.id == defaultPlatforms.windowsPlatformId ? (
            <FaWindows />
          ) : file.platform.id == defaultPlatforms.macOsPlatformId ? (
            <FaApple />
          ) : file.platform.id == defaultPlatforms.linuxPlatformId ? (
            <FaLinux />
          ) : (
            <FaFileArchive />
          )
        }
        onClick={handleDownload}
        size="large"
      >
        Download
      </Button>

      <div>
        <div className="flex gap-2 items-center flex-1">
          <span className="font-semibold">
            {file.displayName ? file.displayName : "unnamed file"}
          </span>
          <span className="text-sm text-zinc-400">
            &nbsp;({file.size.toFixed(1)} MB)
          </span>
        </div>
        <p className="text-xs">
          <FaRegClock className="inline mb-0.5 me-1" />
          {timeAgo(new Date(Date.now() - 24 * 60 * 60 * 1000))}
        </p>
      </div>
    </div>
  );
};

export default DownloadCard;
