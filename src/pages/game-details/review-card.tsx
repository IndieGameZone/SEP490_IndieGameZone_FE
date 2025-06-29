import { timeAgo } from "@/lib/date-n-time";
import { Avatar, Button, Rate, Tooltip } from "antd";
import { CiUser } from "react-icons/ci";
import { FaFlag } from "react-icons/fa";
import { AiFillDislike, AiFillLike } from "react-icons/ai";

const ReviewCard = () => {
  return (
    <div className="p-3 rounded bg-zinc-800 mb-3">
      <div className="flex gap-3">
        <div>
          <Avatar icon={<CiUser />} />
        </div>
        <div>
          <div className="flex">
            <div className="flex-1">
              <p className="font-bold">Player</p>
              <p className="text-xs text-zinc-500">
                {timeAgo(new Date("11/11/2024"))}
              </p>
            </div>
            <Tooltip title="Report review">
              <Button shape="circle" icon={<FaFlag />}></Button>
            </Tooltip>
          </div>
          <div className="my-1">
            <Rate disabled defaultValue={4} />
          </div>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas, odit
            aut! Aspernatur, harum, qui sed similique possimus rem asperiores
            consequatur quibusdam in doloremque suscipit vitae voluptate aliquid
            quo, illum tempora.
          </p>
          <div className="mt-1">
            <p className="text-xs text-zinc-500">Was this review helpful?</p>
            <div className="flex gap-3 mt-1 items-center">
              <div className="flex gap-1 items-center">
                0
                <Button
                  type="text"
                  icon={<AiFillDislike />}
                  iconPosition="end"
                  shape="circle"
                ></Button>
              </div>
              <div className="flex gap-1 items-center">
                0
                <Button
                  type="text"
                  icon={<AiFillLike />}
                  iconPosition="end"
                  shape="circle"
                ></Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;
