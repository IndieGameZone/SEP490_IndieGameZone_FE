import { Empty } from "antd";
import DownloadEntryCard from "./download-entry-card";
import useDownloadStore from "@/store/use-download-store";

const DownloadProcessList = () => {
  const { downloads } = useDownloadStore();
  // const [availableBytes, setAvailableBytes] = useState<number | undefined>(
  //   undefined
  // );

  // useEffect(() => {
  //   getEstimatedAvailableBytes();
  // }, [navigator.storage]);

  // const getEstimatedAvailableBytes = async () => {
  //   if ("storage" in navigator && "estimate" in navigator.storage) {
  //     const { quota, usage } = await navigator.storage.estimate();
  //     if (quota && usage) {
  //       const available = quota - usage;
  //       setAvailableBytes(available);
  //     }
  //   }
  // };

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
      {/* {availableBytes && (
        <p className="text-center text-xs text-zinc-500">Available storage (estimated): {formatBytes(availableBytes)}</p>
      )} */}
    </div>
  );
};

export default DownloadProcessList;
