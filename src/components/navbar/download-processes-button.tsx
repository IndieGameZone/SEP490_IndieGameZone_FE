import { Badge, Button, Popover } from "antd";
import { FaDownload } from "react-icons/fa";
import DownloadProcessList from "./download-processes-list";
import useDownloadStore from "@/store/use-download-store";
import { useEffect, useRef, useState } from "react";

const DownloadProcessesButton = () => {
  const { downloads } = useDownloadStore();

  const latestValueRef = useRef(downloads);
  const [entries, setEntries] = useState(downloads);

  useEffect(() => {
    latestValueRef.current = downloads;
  }, [downloads]);

  useEffect(() => {
    const interval = setInterval(() => {
      setEntries(latestValueRef.current); 
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const numberOfProccesses = Object.keys(entries).length;
  return (
    <div>
      <Popover
        content={<DownloadProcessList downloads={entries} />}
        title={<h2 className="font-bold">Download Proccesses</h2>}
        trigger="click"
      >
        <Badge count={numberOfProccesses}>
          <Button shape="circle" icon={<FaDownload />} />
        </Badge>
      </Popover>
    </div>
  );
};

export default DownloadProcessesButton;
