import { Badge, Button, Popover } from "antd";
import { FaDownload } from "react-icons/fa";
import DownloadProcessList from "./download-processes-list";
import useDownloadStore from "@/store/use-download-store";
import { useEffect, useState } from "react";

const DownloadProcessesButton = () => {
  const { downloads } = useDownloadStore();
  const [numOfActiveEntries, setNumOfActiveEntries] = useState(0);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const keys = Object.keys(downloads);
    var count = 0;
    keys.forEach((k) => {
      if (downloads[k].status == "downloading") {
        count++;
      }
    });
    setNumOfActiveEntries(count);
  }, [downloads]);
  
  console.log("first");
  return (
    <div>
      <Popover
        content={<DownloadProcessList downloads={downloads} />}
        title={<h2 className="font-bold">Download Proccesses</h2>}
        trigger="click"
        open={open}
        onOpenChange={setOpen}
      >
        <Badge count={numOfActiveEntries}>
          <Button shape="circle" icon={<FaDownload />} />
        </Badge>
      </Popover>
    </div>
  );
};

export default DownloadProcessesButton;
