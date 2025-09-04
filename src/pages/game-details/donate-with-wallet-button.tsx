import { Button } from "antd";
import { useEffect, useState } from "react";
import { FaWallet } from "react-icons/fa";
import useGameStore from "@/store/use-game-store";
import useAuthStore from "@/store/use-auth-store";
import useLibraryStore from "@/store/use-library-store";
import { donateGame } from "@/lib/api/payment-api";
import { useGlobalMessage } from "@/components/message-provider";
import { useNavigate } from "react-router-dom";
import WalletPaymentModal from "@/components/wallet-payment-modal";

interface DonateWithWalletButtonProps {
  amount: number;
  userId: string;
  gameId: string;
}

const DonateWithWalletButton = ({
  amount,
  userId,
  gameId,
}: DonateWithWalletButtonProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { game } = useGameStore();
  const { profile, fetchProfile } = useAuthStore();
  const { ownedGameIds, fetchOwnedGameIds } = useLibraryStore();
  const [loading, setLoading] = useState(false);
  const messageApi = useGlobalMessage();
  const navigate = useNavigate();

  useEffect(() => {
    if (userId && ownedGameIds.length === 0) {
      fetchOwnedGameIds(userId);
    }
  }, [userId, ownedGameIds.length]);

  const handleConfirm = async () => {
    if (!profile?.id || !game?.id) {
      messageApi.error("User or game information is missing.");
      return false;
    }

    setLoading(true);
    try {
      const response = await donateGame(profile.id, gameId, {
        Amount: amount,
        PaymentMethod: "Wallet",
      });
      if (response.success) {
        messageApi.success("Donation successful!");
        navigate("/account/transaction-history");
      } else {
        messageApi.error(response.error || "Failed to process donation.");
      }
    } catch (err) {
      messageApi.error("An unexpected error occurred during donation.");
    } finally {
      setLoading(false);
    }
    return true;
  };

  const handleOpenModal = () => {
    fetchProfile();
    setIsModalOpen(true);
  };

  if (!game || !profile) return null;

  return (
    <>
      <Button
        size="large"
        icon={<FaWallet />}
        onClick={handleOpenModal}
        loading={loading}
      >
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

export default DonateWithWalletButton;
