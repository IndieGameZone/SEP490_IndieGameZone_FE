import { Card } from "antd";
import { FaCoins } from "react-icons/fa";
import { MdAccountBalanceWallet } from "react-icons/md";
import TopUpButton from "./top-up-button";
import { formatCurrencyVND } from "@/lib/currency";

const BALANCE = 25_000;
const UserWallet = () => {
  return (
    <>
      <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="bg-white bg-opacity-20 p-3 rounded-full">
              <MdAccountBalanceWallet className="text-2xl" />
            </div>
            <div>
              <h2 className="text-lg font-medium mb-1">Current Balance</h2>
              <p className="text-3xl font-bold flex items-center gap-2">
                <FaCoins className="text-yellow-300" />
                {formatCurrencyVND(BALANCE)}
              </p>
            </div>
          </div>
          <TopUpButton />
        </div>
      </Card>
    </>
  );
};

export default UserWallet;
