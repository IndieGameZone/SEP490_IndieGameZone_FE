import { Game } from "@/types/game";
import { Button, Dropdown, Modal, message } from "antd";
import {
  DeleteOutlined,
  MoreOutlined,
  EyeOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import useGameStore from "@/store/use-game-store";
import { updateGameActivation } from "@/lib/api/game-api";
import { useClipboard } from "@/hooks/use-clipboard";
import { FaRegClipboard } from "react-icons/fa";

const ActionMenu = ({ record }: { record: Game }) => {
  const navigate = useNavigate();
  const { fetchGameById, rerender } = useGameStore();
  const [messageApi, contextHolder] = message.useMessage();
  const { copyToClipboard } = useClipboard();

  const handleDelete = (game: Game) => {
    Modal.confirm({
      title: "Are you sure?",
      content: `Do you want to delete game "${game.name}"?`,
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        messageApi.open({
          type: "success",
          content: `Game "${game.name}" deleted successfully`,
        });
        setTimeout(rerender, 1000);
      },
    });
  };

  const handleView = (game: Game) => {
    navigate(`/admin/game/${game.id}`);
  };

  const handleApprove = (game: Game) => {
    Modal.confirm({
      title: "Approve Game",
      content: `Do you want to approve game "${game.name}"?`,
      okText: "Approve",
      okType: "primary",
      cancelText: "Cancel",
      async onOk() {
        const result = await updateGameActivation(game.id, "Approved");
        if (result.success) {
          messageApi.open({
            type: "success",
            content: `Game "${game.name}" approved successfully`,
          });
          setTimeout(() => fetchGameById(game.id), 1000);
        } else {
          messageApi.open({
            type: "error",
            content: result.error || "Failed to approve game",
          });
        }
      },
    });
  };

  const handleReject = (game: Game) => {
    Modal.confirm({
      title: "Reject Game",
      content: `Do you want to reject game "${game.name}"?`,
      okText: "Reject",
      okType: "danger",
      cancelText: "Cancel",
      async onOk() {
        const result = await updateGameActivation(game.id, "Rejected");
        if (result.success) {
          messageApi.open({
            type: "success",
            content: `Game "${game.name}" rejected`,
          });
          setTimeout(() => fetchGameById(game.id), 1000);
        } else {
          messageApi.open({
            type: "error",
            content: result.error || "Failed to reject game",
          });
        }
      },
    });
  };

  const handleCopyToClipboard = async () => {
    const result = await copyToClipboard(record.id);
    if (result) {
      messageApi.success("Copy to clipboard successfully!");
    } else {
      messageApi.error("Failed to copy to clipboard!");
    }
  };

  return (
    <>
      {contextHolder}
      <Dropdown
        menu={{
          items: [
            {
              key: "view",
              label: "View Details",
              icon: <EyeOutlined />,
              onClick: () => handleView(record),
            },
            {
              key: "copy-id",
              label: "Copy game ID",
              icon: <FaRegClipboard />,
              onClick: () => handleCopyToClipboard(),
            },
            ...(record.censorStatus === "PendingManualReview" ||
            record.censorStatus === "PendingAIReview"
              ? [
                  {
                    type: "divider" as const,
                  },
                  {
                    key: "approve",
                    label: "Approve",
                    icon: <CheckCircleOutlined className="text-green-500" />,
                    onClick: () => handleApprove(record),
                  },
                  {
                    key: "reject",
                    label: "Reject",
                    icon: <CloseCircleOutlined className="text-red-500" />,
                    onClick: () => handleReject(record),
                  },
                ]
              : []),
            {
              type: "divider" as const,
            },
            {
              key: "delete",
              label: "Delete Game",
              icon: <DeleteOutlined />,
              danger: true,
              onClick: () => handleDelete(record),
            },
          ],
        }}
        trigger={["click"]}
      >
        <Button type="text" icon={<MoreOutlined />} />
      </Dropdown>
    </>
  );
};

export default ActionMenu;
