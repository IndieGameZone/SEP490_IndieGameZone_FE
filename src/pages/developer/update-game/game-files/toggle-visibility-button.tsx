import { useGlobalMessage } from "@/components/message-provider";
import { toggleFileVisibility } from "@/lib/api/game-api";
import useAuthStore from "@/store/use-auth-store";
import useGameStore from "@/store/use-game-store";
import { GameFile } from "@/types/game";
import { Button, Popconfirm, PopconfirmProps } from "antd";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const ToggleVisibilityButton = ({ file }: { file: GameFile }) => {
  const [confirmLoading, setConfirmLoading] = useState(false);
  const messageApi = useGlobalMessage();
  const { profile } = useAuthStore();
  const { rerender } = useGameStore();
  const confirm: PopconfirmProps["onConfirm"] = async (_) => {
    if (!profile) return;
    setConfirmLoading(true);
    const result = await toggleFileVisibility(file.id, !file.isActive);
    if (result.error) {
      messageApi.error("Failed to update file visibility! Please try again.");
    } else {
      rerender();
    }
    setConfirmLoading(false);
  };

  const cancel: PopconfirmProps["onCancel"] = (_) => {
    // console.log(e);
  };
  return (
    <Popconfirm
      title={
        file.isActive
          ? `Hide ${file.displayName} from front page`
          : `Show ${file.displayName} in front page`
      }
      description={
        file.isActive
          ? "Players who purchased your game still can access it"
          : "This file will appear on top of the download page"
      }
      onConfirm={confirm}
      onCancel={cancel}
      okButtonProps={{ loading: confirmLoading }}
    >
      <Button
        icon={file.isActive ? <FaEyeSlash /> : <FaEye />}
        shape="circle"
      />
    </Popconfirm>
  );
};

export default ToggleVisibilityButton;
