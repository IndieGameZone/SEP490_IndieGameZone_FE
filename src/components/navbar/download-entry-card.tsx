import { DownloadEntry } from "@/types/download-entry";
import FileIcon from "../file-icon";
import { Button, Progress } from "antd";
import { formatBytes, formatTimeLeft } from "@/lib/file";
import { IoClose, IoPause, IoPlay } from "react-icons/io5";

const processStatusMap: Record<
  string,
  "active" | "success" | "exception" | "normal" | undefined
> = {
  idle: "normal",
  downloading: "active",
  success: "success",
  error: "exception",
  cancelled: "normal",
};

const DownloadEntryCard = ({
  downloadEntry,
}: {
  downloadEntry: DownloadEntry;
}) => {
  const nameParts = downloadEntry.filename.split(".");
  const fileExtension = nameParts[nameParts.length - 1];

  return (
    <div className="p-2 bg-transparent hover:bg-zinc-800 rounded duration-300">
      <div className="flex gap-2 items-center ">
        <div className="text-2xl">
          {<FileIcon fileExtension={fileExtension} />}
        </div>
        <div className="flex-1">
          <h5 className="font-semibold">{downloadEntry.filename}</h5>
          <p className="text-xs text-zinc-400">
            {formatBytes(downloadEntry.receivedBytes ?? 0)}/
            {formatBytes(downloadEntry.totalBytes ?? 0)}
            {downloadEntry.status == "downloading" &&
              downloadEntry.estimatedTimeLeft &&
              " • " + formatTimeLeft(downloadEntry.estimatedTimeLeft)}
          </p>
        </div>
        {downloadEntry.status == "downloading" ? (
          <Button type="text" size="small" shape="circle" icon={<IoPause />} />
        ) : (
          downloadEntry.status == "idle" && (
            <Button type="text" size="small" shape="circle" icon={<IoPlay />} />
          )
        )}
        <Button type="text" size="small" shape="circle" icon={<IoClose />} />
      </div>
      <Progress
        percent={downloadEntry.progress * 100}
        format={(percent) => percent?.toFixed(2) + "%"}
        className="mt-1"
        size={"small"}
        status={processStatusMap[downloadEntry.status]}
      />
    </div>
  );
};

export default DownloadEntryCard;
