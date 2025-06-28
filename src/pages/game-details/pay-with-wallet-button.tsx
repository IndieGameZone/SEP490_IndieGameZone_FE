import CoinIcon from "@/components/coin-icon";
import useGameStore from "@/store/use-game-store";
import { Button, Modal } from "antd";
import { useState } from "react";
import { FaArrowRight, FaWallet } from "react-icons/fa";

const PayWithWalletButton = ({ amount }: { amount: number }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { game } = useGameStore();
  const [balance, _] = useState(1_000_000);
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  if (!game) return;
  return (
    <>
      <Button
        size="large"
        style={{ marginTop: "1.5rem" }}
        icon={<FaWallet />}
        onClick={showModal}
      >
        Pay with wallet
      </Button>
      <Modal
        title={<h2 className="text-xl font-bold">Confirm Payment</h2>}
        closable={{ "aria-label": "Custom Close Button" }}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <div>
          <p className="text-lg">
            You're about to use{" "}
            <strong>{amount.toLocaleString("vi-VN")} </strong>
            <CoinIcon className="inline mb-1" /> to buy{" "}
            <strong>'{game?.name}'</strong>.
            {amount > game.price && (
              <>
                <br />
                <span className="text-sm text-zinc-400">
                  {" "}
                  (including your donation)
                </span>
              </>
            )}
          </p>
          <div className="mt-5 flex justify-center items-center bg-zinc-900 border border-zinc-700 gap-5 py-3 px-5 rounded">
            <div className="text-2xl">
              {" "}
              {balance.toLocaleString("vi-VN")}{" "}
              <CoinIcon className="inline mb-1" size="size-6" />
            </div>
            <FaArrowRight className="size-6" />
            <div className="text-2xl text-red-500">
              {balance >= amount ? (
                <>
                  {(balance - amount).toLocaleString("vi-VN")}{" "}
                  <CoinIcon className="inline mb-1" size="size-6" />
                </>
              ) : (
                "Insufficient"
              )}
            </div>
          </div>
          <p className="text-center text-sm text-zinc-400 italic mb-5">
            Exchange rate: 1 point = 1 VND
          </p>
          <div className="mb-4 text-sm">
            <p>
              <span className="font-semibold">
                Current Balance: {balance.toLocaleString("vi-VN")}
              </span>{" "}
              <CoinIcon className="inline mb-1" />
            </p>
            <p className="mt-1">
              <span className="font-semibold">Remaining After Payment:</span>{" "}
              {balance >= amount ? (
                <>
                  {(balance - amount).toLocaleString("vi-VN")}{" "}
                  <CoinIcon className="inline mb-1" />
                </>
              ) : (
                "Insufficient"
              )}{" "}
            </p>
            <p></p>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default PayWithWalletButton;
