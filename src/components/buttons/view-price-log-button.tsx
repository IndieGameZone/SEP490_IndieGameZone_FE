import useDocumentTheme from "@/hooks/use-document-theme";
import { formatCurrencyVND } from "@/lib/currency";
import { formatDateTime } from "@/lib/date-n-time";
import { Button, Modal, Steps } from "antd";
import type { StepProps } from "antd";
import {  useMemo, useState } from "react";
import { FaHistory, FaMoneyBill } from "react-icons/fa";

interface PriceLog {
  id: string;
  price: number;
  createdAt: string;
}

interface ViewPriceLogButtonProps {
  priceLogs: PriceLog[];
}

const ViewPriceLogButton = ({ priceLogs }: ViewPriceLogButtonProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const theme = useDocumentTheme();
  const isDarkTheme = theme === "dark";

  const groupedSteps = useMemo(() => {
    const groups: Record<string, StepProps[]> = {};

    for (let i = 0; i < priceLogs.length; i++) {
      const log = priceLogs[i];
      const dateKey = new Date(log.createdAt).toISOString().split("T")[0]; // yyyy-mm-dd

      if (!groups[dateKey]) groups[dateKey] = [];

      groups[dateKey].push({
        title: `Price: ${formatCurrencyVND(log.price)}`,
        icon: (
          <div
            className={`rounded-full aspect-square flex justify-center items-center ${
              i === 0 ? (isDarkTheme ? "bg-orange-900" : "bg-orange-200") : isDarkTheme ? "bg-zinc-700" : "bg-zinc-300"
            }`}
          >
            <FaMoneyBill className={i === 0 ? "text-orange-500" : "text-zinc-400"} />
          </div>
        ),
        description: (
          <div>
            {formatDateTime(new Date(log.createdAt))}
          </div>
        ),
      });
    }

    return groups;
  }, [priceLogs]);

  const showModal = () => setIsModalOpen(true);
  const handleCancel = () => setIsModalOpen(false);

  if (priceLogs.length === 0) return null;

  return (
    <>
      <Button 
        type="text" 
        onClick={showModal} 
        icon={<FaHistory className="text-zinc-500" />} 
        shape="circle"
        title="Price history"
      />
      <Modal title="Price history" open={isModalOpen} onCancel={handleCancel} footer={null}>
        <div className="space-y-8">
          {Object.entries(groupedSteps).map(([date, steps]) => (
            <div key={date}>
              <h3 className="text-lg font-semibold mb-2">{new Date(date).toLocaleDateString()}</h3>
              <Steps current={0} items={steps} direction="vertical" />
            </div>
          ))}
        </div>
      </Modal>
    </>
  );
};

export default ViewPriceLogButton;