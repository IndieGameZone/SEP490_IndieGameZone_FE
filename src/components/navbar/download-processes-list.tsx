import { Empty } from "antd";
import DownloadEntryCard from "./download-entry-card";
import { DownloadEntry } from "@/types/download-entry";

const DownloadProcessList = ({
  downloads,
}: {
  downloads: Record<string, DownloadEntry>;
}) => {
  const proccessKeys = Object.keys(downloads);
  return (
    <div className="w-[350px] max-h-[500px] overflow-auto">
      {proccessKeys.length == 0 && (
        <div className="py-20">
          <Empty description="There is currently no download process." />
        </div>
      )}
      {proccessKeys.map((x: string, index: number) => {
        return (
          <DownloadEntryCard
            key={`download-entry-${index}`}
            downloadEntry={downloads[x]}
          />
        );
      })}
    </div>
  );
};

export default DownloadProcessList;
