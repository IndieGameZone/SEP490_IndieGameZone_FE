import { Modal, Button } from "antd";
import { GameKey } from "@/types/game-key";
import { RiAddLine } from "react-icons/ri";
import { useState } from "react";
import { useGlobalMessage } from "@/components/message-provider";
import { createKeyByGameID } from "@/lib/api/game-key-api";

interface GameKeyModalProps {
  open: boolean;
  onClose: () => void;
  gameId?: string;
  gameKeys: GameKey[];
  onKeysUpdated: () => void;
  darkTheme?: boolean;
}

const GameKeyModal = ({ open, onClose, gameId, gameKeys, onKeysUpdated, darkTheme = true }: GameKeyModalProps) => {
  const [loading, setLoading] = useState(false);
  const messageApi = useGlobalMessage();

  const handleGenerateKey = async () => {
    if (!gameId) return;

    try {
      setLoading(true);
      const result = await createKeyByGameID(gameId);
      if (result.success) {
        messageApi.success("Game key generated successfully!");
        onKeysUpdated();
      } else {
        messageApi.error(result.error || "Failed to generate game key");
      }
    } catch (error) {
      messageApi.error("An error occurred while generating the game key");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal title="Game Keys Management" open={open} onCancel={onClose} footer={null} width={600}>
      <div className="mt-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Available Keys</h3>
          <Button type="primary" icon={<RiAddLine />} onClick={handleGenerateKey} loading={loading}>
            Generate New Key
          </Button>
        </div>

        <div className="space-y-2 max-h-[400px] overflow-y-auto">
          {gameKeys.length > 0 ? (
            gameKeys.map((key) => (
              <div
                key={key.id}
                className={`font-mono p-3 rounded ${
                  key.isUsed
                    ? `text-red-500 ${darkTheme ? "bg-zinc-800" : "bg-gray-100"}`
                    : `text-green-500 ${darkTheme ? "bg-zinc-800" : "bg-gray-100"}`
                }`}
              >
                {key.key}
                <span className="ml-2 text-xs">{key.isUsed ? "(Used)" : "(Available)"}</span>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500 py-4">No game keys available</div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default GameKeyModal;
