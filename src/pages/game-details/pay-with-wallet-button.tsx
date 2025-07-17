import CoinIcon from "@/components/coin-icon";
import useGameStore from "@/store/use-game-store";
import { Button, Modal } from "antd";
import { useEffect, useState } from "react";
import { FaArrowRight, FaWallet } from "react-icons/fa";
import useAuthStore from "@/store/use-auth-store";
import useLibraryStore from "@/store/use-library-store";
import { purchaseGame } from "@/lib/api/payment-api";
import { useGlobalMessage } from "@/components/message-provider";
import { useNavigate } from "react-router-dom";

interface PayWithWalletButtonProps {
  amount: number;
  userId: string;
  gameId: string;
}

const PayWithWalletButton = ({
  amount,
  userId,
  gameId,
}: PayWithWalletButtonProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { game } = useGameStore();
  const { profile } = useAuthStore();
  const { ownedGameIds, fetchOwnedGameIds } = useLibraryStore();
  const [isLoading, setIsLoading] = useState(false);
  const messageApi = useGlobalMessage();
  const navigate = useNavigate();

  useEffect(() => {
    if (!profile && userId) {
    }
    if (userId && ownedGameIds.length === 0) {
      fetchOwnedGameIds(userId);
    }
  }, [profile, userId, ownedGameIds.length]);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = async () => {
    if (!profile?.balance || profile.balance < amount) {
      messageApi.error("Insufficient balance");
      return;
    }
    if (!game) {
      messageApi.error("or invalid game data");
      return;
    }
    setIsLoading(true);
    const result = await purchaseGame(userId, gameId,amount, undefined, "Wallet");
    setIsLoading(false);
    if (result.success) {
      messageApi.success("Purchase successful! Proceeding to download.");
      setTimeout(() => {
        navigate(`/download/${game.id}`);
      }, 1000);
      setIsModalOpen(false);
    } else {
      messageApi.error(result.error || "Purchase failed");
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  if (!game) return null;

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
        title={<h2 className="text-xl font-bold">Confirm Purchase</h2>}
        closable
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
      >
        <div>
          <p className="text-lg">
            You're about to use{" "}
            <strong>{amount.toLocaleString("vi-VN")}</strong>
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
              {profile?.balance?.toLocaleString("vi-VN") ?? "0"}{" "}
              <CoinIcon className="inline mb-1" size="size-6" />
            </div>
            <FaArrowRight className="size-6" />
            <div className="text-2xl text-red-500">
              {profile?.balance != null && profile.balance >= amount ? (
                <>
                  {(profile.balance - amount).toLocaleString("vi-VN")}{" "}
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
                Current Balance:{" "}
                {profile?.balance?.toLocaleString("vi-VN") ?? "0"}
              </span>{" "}
              <CoinIcon className="inline mb-1" />
            </p>
            <p className="mt-1">
              <span className="font-semibold">Remaining After Payment:</span>{" "}
              {profile?.balance != null && profile.balance >= amount ? (
                <>
                  {(profile.balance - amount).toLocaleString("vi-VN")}{" "}
                  <CoinIcon className="inline mb-1" />
                </>
              ) : (
                "Insufficient"
              )}{" "}
            </p>
          </div>
        </div>
        <div className="flex gap-3 justify-end">
          <Button onClick={handleCancel} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            type="primary"
            onClick={handleOk}
            loading={isLoading}
            disabled={profile && profile.balance < amount}
          >
            Confirm Purchase
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default PayWithWalletButton;
