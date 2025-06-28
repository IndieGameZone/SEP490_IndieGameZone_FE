import { FaRegQuestionCircle, FaWallet } from "react-icons/fa";
import TopUpButton from "./top-up-button";
import coinImage from "@/assets/igz_coin.png";
import { Link } from "react-router-dom";

const BALANCE = 25_000;
const UserWallet = () => {
  return (
    <>
      <div className="py-4 px-5 bg-orange-900 border border-orange-500">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="bg-zinc-800 bg-opacity-20 p-4 rounded-full border border-zinc-500">
              <FaWallet className="text-3xl" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm">Current Balance</h2>
                <Link to="/policy/igz-points">
                  <FaRegQuestionCircle />
                </Link>
              </div>
              <p className="text-3xl flex items-center gap-2">
                <img src={coinImage} alt="" className="size-5" />
                {BALANCE.toLocaleString()}
              </p>
            </div>
          </div>
          <TopUpButton />
        </div>
      </div>
    </>
  );
};

export default UserWallet;
