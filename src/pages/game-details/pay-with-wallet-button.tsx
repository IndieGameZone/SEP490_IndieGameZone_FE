import { Button } from "antd";
import { useEffect, useState } from "react";
import { FaWallet } from "react-icons/fa";
import useGameStore from "@/store/use-game-store";
import useAuthStore from "@/store/use-auth-store";
import useLibraryStore from "@/store/use-library-store";
import { purchaseGame } from "@/lib/api/payment-api";
import { useGlobalMessage } from "@/components/message-provider";
import { useNavigate } from "react-router-dom";
import WalletPaymentModal from "@/components/wallet-payment-modal";

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
  const { profile, fetchProfile } = useAuthStore();
  const { ownedGameIds, fetchOwnedGameIds } = useLibraryStore();
  const messageApi = useGlobalMessage();
  const navigate = useNavigate();

  useEffect(() => {
    if (userId && ownedGameIds.length === 0) {
      fetchOwnedGameIds(userId);
    }
  }, [userId, ownedGameIds.length]);

  const handleConfirm = async () => {
    if (!game) {
      messageApi.error("Invalid game data");
      return false;
    }
    const result = await purchaseGame(
      userId,
      gameId,
      amount,
      undefined,
      "Wallet"
    );
    if (result.success) {
      messageApi.success("Purchase successful! Proceeding to download.");
      setTimeout(() => {
        fetchProfile();
        navigate(`/download/${game.id}`);
      }, 1000);
      return true;
    } else {
      messageApi.error(result.error || "Purchase failed");
      return false;
    }
  };

  const handleOpenModal = () => {
    fetchProfile();
    setIsModalOpen(true);
  };

  if (!game || !profile) return null;

  return (
    <>
      <Button size="large" icon={<FaWallet />} onClick={handleOpenModal}>
        Pay with wallet
      </Button>
      <WalletPaymentModal
        open={isModalOpen}
        amount={amount}
        itemName={game.name}
        userBalance={profile.balance}
        onConfirm={handleConfirm}
        onCancel={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default PayWithWalletButton;
