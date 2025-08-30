import { Button, Dropdown } from "antd";
import { FaEye, FaEllipsisV } from "react-icons/fa";
import { GamePost } from "@/types/game-post";

interface ActionMenuProps {
  record: GamePost;
  onSuccess?: () => void;
  onViewDetail?: (postId: string) => void;
}

const ActionMenu = ({ record, onViewDetail }: ActionMenuProps) => {
  const handleViewDetails = () => {
    if (onViewDetail && record.id) {
      onViewDetail(record.id);
    }
  };

  return (
    <>
      <Dropdown
        menu={{
          items: [
            {
              key: "view",
              label: <span className="text-blue-400">View Details</span>,
              icon: <FaEye />,
              onClick: handleViewDetails,
            },
          ],
        }}
        trigger={["click"]}
      >
        <Button type="text" icon={<FaEllipsisV />} />
      </Dropdown>
    </>
  );
};

export default ActionMenu;
