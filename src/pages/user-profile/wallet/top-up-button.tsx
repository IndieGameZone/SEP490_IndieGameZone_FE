import { Button, InputNumber, Modal, message } from "antd";
import { useState } from "react";
import { FaCoins, FaPlus } from "react-icons/fa";

const DEFAULT_TOP_UP_AMOUNT = 10_000;
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
        type="primary"
        size="large"
        icon={<FaPlus />}
        className="bg-white text-blue-600 border-0 hover:bg-blue-50 font-semibold px-6"
        onClick={() => setIsTopUpModalVisible(true)}
      >
        Top Up
      </Button>
      <Modal
        title={
          <div className="flex items-center gap-2">
            <FaPlus className="text-blue-600" />
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
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Points Amount
            </label>
            <InputNumber
              placeholder="Enter points amount (e.g. 50,000)"
              prefix={<FaCoins className="text-gray-400" />}
              size="large"
              value={topUpAmount}
              onChange={handleInputChange}
            />
          </div>

          <div className="bg-blue-50 p-4 rounded-lg mb-4">
            <p className="text-sm text-blue-600 mb-1">Notes:</p>
            <p className="text-sm text-gray-600">
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
