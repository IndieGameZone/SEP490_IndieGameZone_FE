import { Button, InputNumber, Modal, message } from "antd";
import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import CoinIcon from "@/components/coin-icon";
import useAuthStore from "@/store/use-auth-store";
import { depositTransaction } from "@/lib/api/payment-api";
import Cookies from "js-cookie";

interface TopUpButtonProps {
  userId: string;
  balance: number;
}

const DEFAULT_TOP_UP_AMOUNT = 10_000;
const MAX_TOP_UP_AMOUNT = 1_000_000;

const TopUpButton = ({ userId, balance }: TopUpButtonProps) => {
  const [isTopUpModalVisible, setIsTopUpModalVisible] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState(DEFAULT_TOP_UP_AMOUNT);
  const [messageApi, contextHolder] = message.useMessage();
  const [isLoading, setIsLoading] = useState(false);
  const { fetchProfile } = useAuthStore();

  const handleTopUp = async () => {
    try {
      setIsLoading(true);
      const response = await depositTransaction(
        userId,
        topUpAmount,
        "Top up points via PayOS"
      );
      setIsLoading(false);
      if (response.success && typeof response.data === "string") {
        messageApi.success("Redirecting to payment...");
        Cookies.set("pendingTransaction", "deposit", {
          expires: new Date(Date.now() + 30 * 60 * 1000),
        });
        window.location.href = response.data;
        setTimeout(() => fetchProfile(), 1000);
      } else {
        messageApi.error(
          response.error || "Failed to initiate top-up. Please try again."
        );
        setIsTopUpModalVisible(false);
      }
    } catch (error) {
      messageApi.error("An unexpected error occurred. Please try again.");
      setIsTopUpModalVisible(false);
    }
  };

  const handleInputChange = (value: number | null) => {
    if (value) {
      setTopUpAmount(value);
    } else {
      setTopUpAmount(DEFAULT_TOP_UP_AMOUNT);
    }
  };

  return (
    <>
      {contextHolder}
      <Button
        size="large"
        icon={<FaPlus />}
        onClick={() => setIsTopUpModalVisible(true)}
        style={{ paddingInline: "2rem" }}
      >
        Top Up
      </Button>
      <Modal
        title={
          <div className="flex items-center gap-2">
            <FaPlus className="text-orange-600" />
            <span>Top Up Points</span>
          </div>
        }
        open={isTopUpModalVisible}
        onCancel={() => {
          setIsTopUpModalVisible(false);
          setTopUpAmount(DEFAULT_TOP_UP_AMOUNT);
        }}
        footer={null}
        width={480}
      >
        <div className="mt-4">
          <div className="mb-4">
            <p className="text-sm text-zinc-200 mb-2">Points Amount</p>
            <InputNumber
              placeholder="Enter points amount (e.g. 50,000)"
              suffix={<CoinIcon />}
              step={10_000}
              min={10_000}
              max={MAX_TOP_UP_AMOUNT}
              size="large"
              value={topUpAmount}
              onChange={handleInputChange}
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
              }
              parser={(value) =>
                value ? parseInt(value.replace(/\./g, "")) : 0
              }
              style={{ width: "100%" }}
            />
            <p className="text-zinc-400 text-xs mt-1">
              Current balance: {balance.toLocaleString("vi-VN")}
              <CoinIcon size="size-3" className="inline mx-1 mb-0.5" />
            </p>
            <div className="flex gap-2 mt-2">
              <Button
                icon={<CoinIcon size="size-4" className="inline mb-0.5" />}
                onClick={() => setTopUpAmount(100_000)}
                iconPosition="end"
              >
                100.000
              </Button>
              <Button
                icon={<CoinIcon size="size-4" className="inline mb-0.5" />}
                onClick={() => setTopUpAmount(200_000)}
                iconPosition="end"
              >
                200.000
              </Button>
              <Button
                icon={<CoinIcon size="size-4" className="inline mb-0.5" />}
                onClick={() => setTopUpAmount(500_000)}
                iconPosition="end"
              >
                500.000
              </Button>
            </div>
          </div>
          <p className="mb-2">
            Points are the digital currency of our platform. You can use them
            to:
          </p>
          <ul className="list-disc list-inside mb-5">
            <li>Purchase and unlock indie games.</li>
            <li>Support your favorite game developers directly.</li>
          </ul>
          <div className="bg-zinc-800 border border-zinc-600 p-4 rounded mb-4">
            <p className="text-sm text-orange-600 mb-1">Notes:</p>
            <p className="text-sm text-zinc-100">
              • Transaction will be processed within 5-10 minutes
              <br />
              • Transaction fee: Free
              <br />• Exchange rate: 1 point = 1 VND
            </p>
          </div>
          <div className="flex gap-3 justify-end">
            <Button
              onClick={() => {
                setIsTopUpModalVisible(false);
                setTopUpAmount(DEFAULT_TOP_UP_AMOUNT);
              }}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="primary"
              icon={<FaPlus />}
              onClick={handleTopUp}
              loading={isLoading}
            >
              Confirm Top Up
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default TopUpButton;
