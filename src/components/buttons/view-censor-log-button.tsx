import useDocumentTheme from "@/hooks/use-document-theme";
import { formatDateTime } from "@/lib/date-n-time";
import useGameStore from "@/store/use-game-store";
import { GameCensorStatus } from "@/types/game";
import { Button, Modal, Steps } from "antd";
import type { StepProps } from "antd";
import { ReactNode, useMemo, useState } from "react";
import {
  FaCheck,
  FaHistory,
  FaHourglassEnd,
  FaHourglassHalf,
  FaTimes,
} from "react-icons/fa";

const censorStatusMap: Record<
  GameCensorStatus,
  { label: string; icon: ReactNode }
> = {
  Approved: { label: "Approved", icon: <FaCheck className="size-4" /> },
  PendingManualReview: {
    label: "Pending Review",
    icon: <FaHourglassEnd className="size-4" />,
  },
  PendingAIReview: {
    label: "Pending AI Review",
    icon: <FaHourglassHalf className="size-4" />,
  },
  Rejected: { label: "Rejected", icon: <FaTimes className="size-4" /> },
};

const ViewCensorLogButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { gameCensorLogs } = useGameStore();
  const theme = useDocumentTheme();
  const isDarkTheme = theme == "dark";

  // Group logs by date (YYYY-MM-DD)
  const groupedSteps = useMemo(() => {
    const groups: Record<string, StepProps[]> = {};

    for (let i = 0; i < gameCensorLogs.length; i++) {
      const log = gameCensorLogs[i];
      const dateKey = new Date(log.createdAt).toISOString().split("T")[0]; // yyyy-mm-dd

      if (!groups[dateKey]) groups[dateKey] = [];

      groups[dateKey].push({
        title: censorStatusMap[log.censorStatus].label,
        icon: (
          <div
            className={`rounded-full aspect-square flex justify-center items-center ${
              i === 0
                ? isDarkTheme
                  ? "bg-orange-900"
                  : "bg-orange-200"
                : isDarkTheme
                ? "bg-zinc-700"
                : "bg-zinc-300"
            }`}
          >
            {censorStatusMap[log.censorStatus].icon}
          </div>
        ),
        description: (
          <div>
            {formatDateTime(new Date(log.createdAt))}
            {log.moderator && (
              <>
                <br />
                by{" "}
                <span className="font-semibold">{log.moderator?.userName}</span>
                <br />
                {log.censorReason && (
                  <>
                    <span className="text-sm text-zinc-500">Reason: </span>
                    <span className="text-sm">{log.censorReason}</span>
                  </>
                )}
              </>
            )}
          </div>
        ),
      });
    }

    return groups;
  }, [gameCensorLogs]);

  const showModal = () => setIsModalOpen(true);
  const handleCancel = () => setIsModalOpen(false);

  if (gameCensorLogs.length === 0) return null;

  return (
    <>
      <Button
        type="text"
        onClick={showModal}
        icon={<FaHistory className="text-zinc-500" />}
        shape="circle"
      />
      <Modal
        title="Censor status history"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
      >
        <div className="space-y-8">
          {Object.entries(groupedSteps).map(([date, steps]) => (
            <div key={date}>
              <h3 className="text-lg font-semibold mb-2">
                {new Date(date).toLocaleDateString()}
              </h3>
              <Steps current={0} items={steps} direction="vertical" />
            </div>
          ))}
        </div>
      </Modal>
    </>
  );
};

export default ViewCensorLogButton;
