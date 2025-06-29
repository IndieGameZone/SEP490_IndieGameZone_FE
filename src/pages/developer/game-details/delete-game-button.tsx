import { deleteGame } from "@/lib/api/game-api";
import useAuthStore from "@/store/use-auth-store";
import useGameStore from "@/store/use-game-store";
import { Button, Popconfirm, message } from "antd";
import { FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const DeleteGameButton = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();
  const { profile } = useAuthStore();
  const { game, clearGameStore } = useGameStore();

  const confirmDelete = async () => {
    if (!profile || !game) return;
    messageApi.open({
      type: "loading",
      content: "Deleting game..",
      duration: 0,
    });
    const result = await deleteGame(profile.id, game.id);
    if (result.error) {
      messageApi.error("Failed to delete game! Please try again.");
    } else {
      messageApi.success("Delete game successfully!");
      clearGameStore();

      setTimeout(() => {
        navigate("/dev/manage-games");
      }, 1000);
    }
  };

  return (
    <>
      {contextHolder}
      <Popconfirm
        title="Are you sure you want to delete this game?"
        description="This action cannot be undone."
        onConfirm={confirmDelete}
        okText="Yes, delete"
        cancelText="Cancel"
      >
        <Button type="default" danger icon={<FaTrash />}>
          Delete Game
        </Button>
      </Popconfirm>
    </>
  );
};

export default DeleteGameButton;
