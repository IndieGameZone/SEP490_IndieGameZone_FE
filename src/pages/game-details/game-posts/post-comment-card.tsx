import { timeAgo } from "@/lib/date-n-time";
import useAuthStore from "@/store/use-auth-store";
import { PostComment } from "@/types/game-post";
import { Avatar, Button, Dropdown, MenuProps } from "antd";
import { useMemo } from "react";
import { FaFlag, FaTrash } from "react-icons/fa";
import { IoMdMore } from "react-icons/io";
import { Link } from "react-router-dom";

interface PostCommentCardProps {
  comment: PostComment;
  onReportComment: (commentId: string) => void;
}

const PostCommentCard = ({
  comment,
  onReportComment,
}: PostCommentCardProps) => {
  const { profile } = useAuthStore();
  const moreOptionItems: MenuProps["items"] = useMemo(() => {
    const items: MenuProps["items"] = [];

    if (profile?.id === comment.user.id) {
      items.push({
        label: <div>Delete comment</div>,
        key: "delete",
        icon: <FaTrash />,
        onClick: () => {},
        danger: true,
      });
    } else {
      items.push({
        label: <div>Report comment</div>,
        key: "report",
        icon: <FaFlag />,
        onClick: () => {
          onReportComment(comment.id);
        },
      });
    }

    return items;
  }, [profile, comment]);

  return (
    <div key={comment.id} className="p-3 hover:bg-zinc-800">
      <div className="flex gap-3">
        <Link className="mt-1" to={`/profile/${comment.user.id}`}>
          <Avatar src={comment.user?.avatar} size={"small"} />
        </Link>
        <div className="flex-1">
          <div>
            <div className="flex items-center justify-between">
              <div className="font-semibold">
                <Link className="mt-1" to={`/profile/${comment.user.id}`}>
                  {comment.user?.userName}{" "}
                </Link>
                <span className="text-xs text-gray-400 ">
                  • {timeAgo(comment.createdAt)}
                </span>
              </div>

              <Dropdown menu={{ items: moreOptionItems }} trigger={["click"]}>
                <Button icon={<IoMdMore />} shape="circle" type="text"></Button>
              </Dropdown>
            </div>
            <div className="text-sm">{comment.content}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCommentCard;
