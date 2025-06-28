import { Button, InputNumber, Modal, message } from "antd";
import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import coinImage from "@/assets/igz_coin.png";

const DEFAULT_TOP_UP_AMOUNT = 10_000;
const MAX_TOP_UP_AMOUNT = 1_000_000;

const TopUpButton = () => {
  const [isTopUpModalVisible, setIsTopUpModalVisible] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState(DEFAULT_TOP_UP_AMOUNT);
  const [messageApi, contextHolder] = message.useMessage();
  const handleTopUp = () => {
    messageApi.success(`Successfully topped up ${topUpAmount} points!`);
    setIsTopUpModalVisible(false);
  };

  const handleInputChange = (value: number | null) => {
    if (value) {
      setTopUpAmount(value);
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
              prefix={<img src={coinImage} className="size-4" />}
              step={10_000}
              min={10_000}
              max={MAX_TOP_UP_AMOUNT}
              size="large"
              value={topUpAmount}
              onChange={handleInputChange}
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              style={{
                width: "100%",
              }}
            />
            <p className="text-zinc-400 text-xs mt-1">
              Current balance:{" "}
              <img src={coinImage} className="size-3 inline mx-1 mb-0.5" />
              {(25_000).toLocaleString()}
            </p>
            <div className="flex gap-2 mt-2">
              <Button
                icon={<img src={coinImage} className="size-4 inline mb-0.5" />}
                onClick={() => setTopUpAmount(100_000)}
              >
                100,000
              </Button>
              <Button
                icon={<img src={coinImage} className="size-4 inline mb-0.5" />}
                onClick={() => setTopUpAmount(200_000)}
              >
                200,000
              </Button>
              <Button
                icon={<img src={coinImage} className="size-4 inline mb-0.5" />}
                onClick={() => setTopUpAmount(500_000)}
              >
                500,000
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
            >
              Cancel
            </Button>
            <Button
              type="primary"
              icon={<FaPlus />}
              className="bg-blue-600"
              onClick={handleTopUp}
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
