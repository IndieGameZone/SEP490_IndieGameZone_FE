import { Badge, Button, Popover } from "antd";
import { FaDownload } from "react-icons/fa";
import DownloadProcessList from "./download-processes-list";
import useDownloadStore from "@/store/use-download-store";
import { useEffect, useRef, useState } from "react";

const DownloadProcessesButton = () => {
  const { downloads } = useDownloadStore();
  const [numOfActiveEntries, setNumOfActiveEntries] = useState(0);
  const [open, setOpen] = useState(false);
  const prevCountRef = useRef(numOfActiveEntries);

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
  
  /*
  Possible improvement: 
  + Throttle or debounce update
  + Avoid auto-opening the popover if the user just manually closed it
  */

  useEffect(() => {
    if (numOfActiveEntries > prevCountRef.current) {
      setOpen(true);
    }
    prevCountRef.current = numOfActiveEntries;
  }, [numOfActiveEntries]);

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
