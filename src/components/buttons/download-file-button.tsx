import { getFileUrl } from "@/lib/api/game-api";
import useAuthStore from "@/store/use-auth-store";
import { GameFile } from "@/types/game";
import { Button } from "antd";
import { useState } from "react";
import { FaDownload } from "react-icons/fa";
import { useGlobalMessage } from "../message-provider";
import useDownloadStore from "@/store/use-download-store";

const DownloadFileButton = ({ file }: { file: GameFile }) => {
  const { profile } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const { startDownload } = useDownloadStore();
  const messageApi = useGlobalMessage();
  const handleDownload = async () => {
    if (!profile) return;
    setLoading(true);
    const result = await getFileUrl(profile.id, file.id);
    setLoading(false);
    if (result.error) {
      messageApi.error("Failed to fetch file! Please try again.");
    } else {
      startDownload(file.file, file.displayName);
      // downloadFile(file.file);
    }
  };
  return (
    <Button
      icon={<FaDownload />}
      shape="circle"
      onClick={handleDownload}
      loading={loading}
    />
  );
};

export default DownloadFileButton;
