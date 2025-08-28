import { DownloadEntry } from "@/types/download-entry";
import FileIcon from "../file-icon";
import { Button, Progress } from "antd";
import { formatBytes, formatTimeLeft } from "@/lib/file";
import { IoClose, IoPause, IoPlay, IoRefresh } from "react-icons/io5";
import useDownloadStore from "@/store/use-download-store";
import useDocumentTheme from "@/hooks/use-document-theme";
import { timeAgo } from "@/lib/date-n-time";

const processStatusMap: Record<
  DownloadEntry["status"],
  "active" | "success" | "exception" | "normal" | undefined
> = {
  idle: "normal",
  downloading: "active",
  paused: "normal",
  success: "success",
  error: "exception",
  cancelled: "normal",
};

type Props = {
  downloadEntry: DownloadEntry;
};

const DownloadEntryCard = ({ downloadEntry }: Props) => {
  const { cancelDownload, pauseDownload, resumeDownload } = useDownloadStore();
  const theme = useDocumentTheme();

  const {
    id,
    filename,
    status,
    totalBytes,
    receivedBytes,
    progress,
    estimatedTimeLeft,
    retryable,
    startedAt,
  } = downloadEntry;

  const fileExtension = filename.split(".").pop() ?? "";

  const handleCancel = () => cancelDownload(id);
  const handlePause = () => pauseDownload(id);
  const handleResume = () => resumeDownload(id);
  const handleRetry = () => resumeDownload(id);

  const renderStatusText = () => {
    if (status === "cancelled") return "Cancelled";

    const sizeText = `${formatBytes(receivedBytes ?? 0)}/${formatBytes(
      totalBytes ?? 0
    )}`;
    if (status === "paused") return `${sizeText} • Paused`;
    if (status === "downloading" && estimatedTimeLeft)
      return `${sizeText} • ${formatTimeLeft(estimatedTimeLeft)}`;
    if (status === "success")
      return `${formatBytes(receivedBytes ?? 0)} • Done`;
    return sizeText;
  };

  const isDarkMode = theme == "dark";

  const renderActionButtons = () => {
    switch (status) {
      case "downloading":
        return (
          <Button
            type="text"
            size="small"
            shape="circle"
            icon={<IoPause />}
            onClick={handlePause}
          />
        );
      case "paused":
        return (
          <Button
            type="text"
            size="small"
            shape="circle"
            icon={<IoPlay />}
            onClick={handleResume}
          />
        );
      case "error":
        return retryable ? (
          <Button
            type="text"
            size="small"
            shape="circle"
            icon={<IoRefresh />}
            onClick={handleRetry}
          />
        ) : null;
      default:
        return null;
    }
  };

  const getFriendlyErrorMessage = (error?: string): string | null => {
    if (!error) return null;
    if (error.includes("The specified blob does not exist")) {
      return "This file is no longer available for download.";
    }
    return "An error occurred during download.";
  };

  return (
    <div
      className={`p-2 bg-transparent ${
        isDarkMode ? "hover:bg-zinc-800" : "hover:bg-zinc-100"
      } rounded duration-300`}
    >
      <div className="flex gap-2 items-center">
        <div className="text-2xl">
          <FileIcon fileExtension={fileExtension} />
        </div>
        <div className="flex-1">
          <h5 className="font-semibold">{filename}</h5>
          <p className="text-xs text-zinc-400">
            {status === "error"
              ? getFriendlyErrorMessage(downloadEntry.error)
              : renderStatusText()}
          </p>
        </div>
        {renderActionButtons()}
        {status !== "cancelled" && status !== "error" && (
          <Button
            type="text"
            size="small"
            shape="circle"
            icon={<IoClose />}
            onClick={handleCancel}
          />
        )}
      </div>
      {status !== "cancelled" && status !== "success" && retryable && (
        <Progress
          percent={progress * 100}
          format={(p) => p?.toFixed(2) + "%"}
          className="mt-1"
          size="small"
          status={processStatusMap[status]}
        />
      )}
    </div>
  );
};

export default DownloadEntryCard;
