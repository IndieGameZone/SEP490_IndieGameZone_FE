import { useGlobalMessage } from "@/components/message-provider";
import { getFileUrl } from "@/lib/api/game-api";
import { timeAgo } from "@/lib/date-n-time";
import { formatMegabytes } from "@/lib/file";
import useAuthStore from "@/store/use-auth-store";
import useDownloadStore from "@/store/use-download-store";
import { GameFile } from "@/types/game";
import { Button } from "antd";
import { useState } from "react";
import {
  FaApple,
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
  const { startDownload } = useDownloadStore();
  const messageApi = useGlobalMessage();
  const [loading, setLoading] = useState(false);
  const { profile } = useAuthStore();

  const handleDownload = async () => {
    if (!profile) return;
    setLoading(true);
    const result = await getFileUrl(profile.id, file.id);
    setLoading(false);
    if (result.error) {
      messageApi.error("Failed to fetch file! Please try again.");
    } else {
      // downloadFile(file.file);
      startDownload(file.file, file.displayName, messageApi);
    }
  };

  return (
    <div
      className={`flex p-2 bg-zinc-900 border-zinc-700 rounded border gap-3 mb-2 items-center`}
    >
      {/* {contextHolder} */}
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
        loading={loading}
      >
        Download
      </Button>

      <div>
        <div className="flex gap-2 items-center flex-1">
          <span className="font-semibold">
            {file.displayName ? file.displayName : "unnamed file"}
          </span>
          <span className="text-sm text-zinc-400">
            {" "}
            ({formatMegabytes(file.size)})
          </span>
        </div>
        <p className="text-xs">
          {file.version} • <FaRegClock className="inline mb-0.5 me-1" />
          {timeAgo(new Date(Date.now() - 24 * 60 * 60 * 1000))}
        </p>
      </div>
    </div>
  );
};

export default DownloadCard;
