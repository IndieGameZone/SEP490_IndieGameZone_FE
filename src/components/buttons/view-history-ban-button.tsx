import { useMemo, useState } from "react";
import { formatDateTime } from "@/lib/date-n-time";
import { Button, Modal, StepProps, Steps } from "antd";
import { FaBan, FaHistory } from "react-icons/fa";
import useUserStore from "@/store/use-user-store";
import Loader from "../loader";

const ViewHistoryBanButton = () => {
  const user = useUserStore((state) => state.user);
  const fetchBanHistory = useUserStore((state) => state.fetchBanHistory);
  const userBanHistory = useUserStore((state) => state.userBanHistory);
  const loading = useUserStore((state) => state.loading);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = async () => {
    if (!user?.id) return;
    await fetchBanHistory(user.id); 
    setIsModalOpen(true);
  };

  const stepItems: StepProps[] = useMemo(() => {
    return userBanHistory.map((x, index) => ({
      title: "Banned",
      icon: (
        <div
          className={`rounded-full aspect-square flex justify-center items-center ${
            index === 0 ? "bg-orange-900" : "bg-zinc-800"
          }`}
        >
          <FaBan  className="text-white" />
        </div>
      ),
      description: (
        <div>
          <div>Banned at: {formatDateTime(new Date(x.banDate))}</div>
          {x.unbanDate && (
            <div className="text-green-500">
              Unbanned at: {formatDateTime(new Date(x.unbanDate))}
            </div>
          )}
          <div className="text-sm mt-1">
            <span className="text-zinc-500">By: </span>
            <span className="font-semibold">{x.bannedByUser?.userName}</span>
          </div>
          {x.reason && (
            <div className="text-sm mt-1">
              <span className="text-zinc-500">Reason: </span>
              <span>{x.reason}</span>
            </div>
          )}
        </div>
      ),
    }));
  }, [userBanHistory]);

  if (!user?.id) return null;

  return (
    <>
      <Button
        type="text"
        onClick={handleOpenModal}
        icon={<FaHistory className="text-zinc-500" />}
        shape="circle"
      />
      <Modal
        title="Ban History"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        {loading ? (
          <div className="text-center py-4 text-zinc-500"><Loader/></div>
        ) : userBanHistory.length === 0 ? (
          <div className="text-center py-4 text-zinc-400">No ban history</div>
        ) : (
          <Steps current={0} items={stepItems} direction="vertical" />
        )}
      </Modal>
    </>
  );
};

export default ViewHistoryBanButton;
