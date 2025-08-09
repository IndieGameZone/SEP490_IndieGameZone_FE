import { Button } from "antd";
import { useState } from "react";
import { FaWallet } from "react-icons/fa";
import useAuthStore from "@/store/use-auth-store";
import { purchaseCommercialPackage } from "@/lib/api/payment-api";
import { useGlobalMessage } from "@/components/message-provider";
import { useNavigate } from "react-router-dom";
import WalletPaymentModal from "@/components/wallet-payment-modal";
import { CommercialPackage } from "@/types/commercial-package";

interface PayWithWalletButtonProps {
  gameId: string;
  commercialPackage: CommercialPackage;
  selectedDate: string;
}

const PayWithWalletButton = ({ gameId, commercialPackage, selectedDate }: PayWithWalletButtonProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { profile, fetchProfile } = useAuthStore();
  const messageApi = useGlobalMessage();
  const navigate = useNavigate();

  const handleConfirm = async () => {
    const result = await purchaseCommercialPackage(
      profile?.id || "",
      gameId,
      commercialPackage.id,
      selectedDate,
      "Wallet"
    );
    if (result.success) {
      messageApi.success("Purchase successful!");
      setTimeout(() => {
        navigate(`/dev/manage-commercial-package`);
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

  if (!profile) return null;

  return (
    <>
      <Button size="large" style={{ marginTop: "1rem", width: "100%" }} icon={<FaWallet />} onClick={handleOpenModal}>
        Pay with wallet
      </Button>
      <WalletPaymentModal
        open={isModalOpen}
        amount={commercialPackage.price}
        itemName={commercialPackage.name}
        userBalance={profile.balance}
        onConfirm={handleConfirm}
        onCancel={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default PayWithWalletButton;
