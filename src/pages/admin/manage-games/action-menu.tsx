import { Game } from "@/types/game";
import { Button, Dropdown, Input, Modal, message } from "antd";
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
import useAuthStore from "@/store/use-auth-store";

interface ActionMenuProps {
  record: Game;
  rerender: () => void;
}
const ActionMenu = ({ record, rerender }: ActionMenuProps) => {
  const navigate = useNavigate();
  const { fetchAllGamesAdmin } = useGameStore();
  const { profile } = useAuthStore();
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
        fetchAllGamesAdmin();
      },
    });
  };

  const handleView = (game: Game) => {
    navigate(`/${profile?.role.name.toLowerCase()}/game/${game.id}`);
  };

  const handleApprove = (game: Game) => {
    if (!profile) return;
    Modal.confirm({
      title: "Approve Game",
      content: `Do you want to approve game "${game.name}"?`,
      okText: "Approve",
      okType: "primary",
      cancelText: "Cancel",
      async onOk() {
        const result = await updateGameActivation(
          game.id,
          "Approved",
          profile.id,
          ""
        );
        if (result.success) {
          messageApi.open({
            type: "success",
            content: `Game "${game.name}" approved successfully`,
          });
          rerender();
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
    if (!profile) return;

    let reason = "";

    Modal.confirm({
      title: `Reject Game "${game.name}"`,
      content: (
        <Input.TextArea
          rows={4}
          placeholder="Enter reason for rejection"
          onChange={(e) => {
            reason = e.target.value;
          }}
        />
      ),
      okText: "Reject",
      okType: "danger",
      cancelText: "Cancel",
      async onOk() {
        if (!reason.trim()) {
          messageApi.error("Please enter a reason for rejection");
          throw new Error("No reason provided");
        }

        const result = await updateGameActivation(
          game.id,
          "Rejected",
          profile.id,
          reason
        );
        if (result.success) {
          messageApi.success(`Game "${game.name}" rejected`);
          rerender();
        } else {
          messageApi.error(result.error || "Failed to reject game");
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
            ...([
              "PendingManualReview",
              "PendingAIReview",
              "Approved",
              "Rejected",
            ].includes(record.censorStatus)
              ? [
                  {
                    type: "divider" as const,
                  },
                  ...(record.censorStatus !== "Approved"
                    ? [
                        {
                          key: "approve",
                          label: "Approve",
                          icon: (
                            <CheckCircleOutlined className="text-green-500" />
                          ),
                          onClick: () => handleApprove(record),
                        },
                      ]
                    : []),
                  ...(record.censorStatus !== "Rejected"
                    ? [
                        {
                          key: "reject",
                          label: "Reject",
                          icon: (
                            <CloseCircleOutlined className="text-red-500" />
                          ),
                          onClick: () => handleReject(record),
                        },
                      ]
                    : []),
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
