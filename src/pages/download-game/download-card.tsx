import { useGlobalMessage } from "@/components/message-provider";
import { getFileUrl } from "@/lib/api/game-api";
import { timeAgo } from "@/lib/date-n-time";
import { downloadFile, formatMegabytes } from "@/lib/file";
import useAuthStore from "@/store/use-auth-store";
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
  // const { downloads, startDownload } = useDownloadStore();
  // const [messageApi, contextHolder] = message.useMessage();
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
      downloadFile(file.file);
    }
    // NORMAL DOWNLOAD
    // const link = document.createElement("a");
    // link.href = file.file;
    // link.download = file.displayName || "";
    // document.body.appendChild(link);
    // link.click();
    // document.body.removeChild(link);
    // DOWNLOAD MANAGED BY CLIENT
    // const existings = Object.values(downloads);
    // if (existings.length > 2) {
    //   messageApi.error("Cannot download more than 2 files at the same time!");
    //   return;
    // } else if (
    //   existings.find(
    //     (entry) =>
    //       entry.url === file.file &&
    //       (entry.status === "downloading" || entry.status === "paused")
    //   )
    // ) {
    //   messageApi.error("Download is already in process!");
    //   return;
    // }
    // startDownload(file.file, file.displayName);
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
            {" "}({formatMegabytes(file.size)})
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
