// components/wallet-payment-modal.tsx

import { Modal, Button } from "antd";
import { useState } from "react";
import { FaArrowRight } from "react-icons/fa";
import CoinIcon from "@/components/coin-icon";
import { useGlobalMessage } from "@/components/message-provider";

interface WalletPaymentModalProps {
  open: boolean;
  amount: number;
  title?: string;
  itemName: string;
  userBalance: number;
  onConfirm: () => Promise<boolean>;
  onCancel: () => void;
}

const WalletPaymentModal = ({
  open,
  amount,
  title = "Confirm Purchase",
  itemName,
  userBalance,
  onConfirm,
  onCancel,
}: WalletPaymentModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const messageApi = useGlobalMessage();
  const hasSufficientBalance = userBalance >= amount;

  const handleOk = async () => {
    if (!hasSufficientBalance) {
      messageApi.error("Insufficient balance");
      return;
    }
    setIsLoading(true);
    const success = await onConfirm();
    setIsLoading(false);
    if (success) onCancel();
  };

  return (
    <Modal
      title={<h2 className="text-xl font-bold">{title}</h2>}
      open={open}
      onCancel={onCancel}
      footer={null}
      closable
    >
      <div>
        <p className="text-lg">
          You're about to use <strong>{amount.toLocaleString("vi-VN")}</strong> <CoinIcon className="inline mb-1" /> to
          buy <strong>'{itemName}'</strong>.
        </p>
        <div className="mt-5 flex justify-center items-center bg-zinc-900 border border-zinc-700 gap-5 py-3 px-5 rounded">
          <div className="text-2xl">
            {userBalance.toLocaleString("vi-VN")} <CoinIcon className="inline mb-1" size="size-6" />
          </div>
          <FaArrowRight className="size-6" />
          <div className="text-2xl text-red-500">
            {hasSufficientBalance ? `${(userBalance - amount).toLocaleString("vi-VN")} ` : "Insufficient"}{" "}
            <CoinIcon className="inline mb-1" size="size-6" />
          </div>
        </div>
        <p className="text-center text-sm text-zinc-400 italic mb-5">Exchange rate: 1 point = 1 VND</p>
        <div className="mb-4 text-sm">
          <p>
            <span className="font-semibold">Current Balance: {userBalance.toLocaleString("vi-VN")}</span>{" "}
            <CoinIcon className="inline mb-1" />
          </p>
          <p className="mt-1">
            <span className="font-semibold">Remaining After Payment:</span>{" "}
            {hasSufficientBalance ? `${(userBalance - amount).toLocaleString("vi-VN")}` : "Insufficient"}{" "}
            <CoinIcon className="inline mb-1" />
          </p>
        </div>
        <div className="flex gap-3 justify-end">
          <Button onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="primary" onClick={handleOk} loading={isLoading} disabled={!hasSufficientBalance}>
            Confirm Purchase
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default WalletPaymentModal;
