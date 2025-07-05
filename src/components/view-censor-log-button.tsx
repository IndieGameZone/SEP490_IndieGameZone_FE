import { formatDateTime } from "@/lib/date-n-time";
import useGameStore from "@/store/use-game-store";
import { GameCensorStatus } from "@/types/game";
import { Button, Modal, StepProps, Steps } from "antd";
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

  const stepItem: StepProps[] = useMemo(
    () =>
      gameCensorLogs
        .map((x) => ({
          title: censorStatusMap[x.censorStatus].label,
          icon: (
            <div className="bg-orange-900 rounded-full aspect-square flex justify-center items-center">
              {censorStatusMap[x.censorStatus].icon}
            </div>
          ),
          description: (
            <div>
              {formatDateTime(new Date(x.createdAt))}
              {x.moderator && (
                <>
                  <br />
                  by <span className="font-semibold">{x.moderator?.userName}</span>
                </>
              )}
            </div>
          ),
        }))
        .reverse(),
    [gameCensorLogs]
  );

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  if (gameCensorLogs.length == 0) {
    return;
  }
  return (
    <>
      <Button
        type="text"
        onClick={showModal}
        icon={<FaHistory className="text-zinc-500" />}
        shape="circle"
      />
      <Modal
        title={"Censor status history"}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
      >
        <Steps
          current={stepItem.length - 1}
          items={stepItem}
          direction="vertical"
        />
      </Modal>
    </>
  );
};

export default ViewCensorLogButton;
