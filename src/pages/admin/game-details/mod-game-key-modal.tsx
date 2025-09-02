import { Modal, Button, Alert } from "antd";
import { GameKey } from "@/types/game-key";
import { RiAddLine } from "react-icons/ri";
import { useState } from "react";
import { useGlobalMessage } from "@/components/message-provider";
import { createModeratorKeyByGameID } from "@/lib/api/game-key-api";
import { FaCheck, FaRegCopy } from "react-icons/fa";
import { useClipboard } from "@/hooks/use-clipboard";

interface GameKeyModalProps {
  open: boolean;
  onClose: () => void;
  gameId?: string;
  gameKeys: GameKey[];
  onKeysUpdated: () => void;
}

const ModGameKeyModal = ({ open, onClose, gameId, onKeysUpdated }: GameKeyModalProps) => {
  const [loading, setLoading] = useState(false);
  const [newKey, setNewKey] = useState<GameKey | null>(null);
  const { isCopied, copyToClipboard } = useClipboard();
  const messageApi = useGlobalMessage();

  const handleGenerateKey = async () => {
    if (!gameId) return;

    try {
      setLoading(true);
      setNewKey(null);

      const result = await createModeratorKeyByGameID(gameId);
      if (result.success) {
        messageApi.success("Game key generated successfully!");
        setNewKey(result.data);
        onKeysUpdated();
      } else {
        messageApi.error(result.error || "Failed to generate game key");
      }
    } catch (error) {
      messageApi.error("An error occurred while generating the game key");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyNewKey = () => {
    if (newKey) {
      copyToClipboard(newKey.key);
    }
  };

  return (
    <Modal
      title="Game Key Management"
      open={open}
      onCancel={() => {
        setNewKey(null);
        onClose();
      }}
      footer={null}
      width={600}
    >
      <div className="mt-4">
        {newKey && (
          <Alert
            message="New Key Generated"
            description={
              <div className="flex justify-between items-center font-mono">
                <span className="text-green-500">{newKey.key}</span>
                <Button
                  size="small"
                  onClick={handleCopyNewKey}
                  icon={isCopied ? <FaCheck /> : <FaRegCopy />}
                  type="text"
                />
              </div>
            }
            type="success"
            showIcon
            className="mb-4"
          />
        )}

        <div className="flex justify-center mt-4">
          <Button type="primary" icon={<RiAddLine />} onClick={handleGenerateKey} loading={loading}>
            Generate New Key
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ModGameKeyModal;
