import CoinIcon from "@/components/coin-icon";
import {
  getDashboardSummary,
  getTotalCurrentDevRevenue,
} from "@/lib/api/admin-dashboard-api";
import { formatCurrencyVND } from "@/lib/currency";
import { useEffect, useState } from "react";
import { CiBank } from "react-icons/ci";
import { FaHandsHelping, FaUser } from "react-icons/fa";
import { FaGamepad } from "react-icons/fa6";
import { GoPackage } from "react-icons/go";
import { HiStatusOnline } from "react-icons/hi";

type Data = {
  onlineUserCount: number;
  totalUserCount: number;

  gamePurchaseRevenueByAdmin: number;
  commercialPackageRevenue: number;
  adminBankBalance: number;
};

const DashboardSummary = () => {
  const [summaryData, setSummaryData] = useState<Data>({
    onlineUserCount: 0,
    totalUserCount: 0,
    adminBankBalance: 0,
    commercialPackageRevenue: 0,
    gamePurchaseRevenueByAdmin: 0,
  });
  const [developerRevenue, setDeveloperRevenue] = useState<number>(0);
  const fetchSummaryData = async () => {
    const result = await getDashboardSummary();
    if (!result.error) {
      setSummaryData(result.data);
    }
  };
  const fetchDeveloperCurrentRevenue = async () => {
    const result = await getTotalCurrentDevRevenue();
    if (!result.error) {
      setDeveloperRevenue(result.data);
    }
  };

  useEffect(() => {
    fetchSummaryData();
    fetchDeveloperCurrentRevenue();
  }, []);

  return (
    <>
      <div className="md:col-span-3 bg-fuchsia-600 text-white p-5 rounded flex items-center gap-5">
        <FaUser className="p-4 size-12 bg-fuchsia-500 rounded-full" />
        <div>
          <p className="text-2xl font-semibold">{summaryData.totalUserCount}</p>
          <p className="text-xs">Total Users</p>
        </div>
      </div>
      <div className="md:col-span-3 bg-yellow-600 text-white p-5 rounded flex items-center gap-5">
        <HiStatusOnline className="p-4 size-12 bg-yellow-500 rounded-full" />
        <div>
          <p className="text-2xl font-semibold">
            {summaryData.onlineUserCount}
          </p>
          <p className="text-xs"> Users Online</p>
        </div>
      </div>
      <div className="md:col-span-3 bg-blue-600 text-white p-5 rounded flex items-center gap-5">
        <GoPackage className="p-4 size-12 bg-blue-500 rounded-full" />
        <div>
          <p className="text-2xl font-semibold">
            {summaryData.commercialPackageRevenue}{" "}
            <CoinIcon className="inline size-5 mb-1" />
          </p>
          <p className="text-xs">Commercial Revenue</p>
        </div>
      </div>
      <div className="md:col-span-3 bg-red-600 text-white p-5 rounded flex items-center gap-5">
        <FaHandsHelping className="p-4 size-12 bg-red-500 rounded-full" />
        <div>
          <p className="text-2xl font-semibold">
            {summaryData.gamePurchaseRevenueByAdmin.toLocaleString("vi-VN")}{" "}
            <CoinIcon className="inline size-5 mb-1" />
          </p>
          <p className="text-xs">Commission Revenue</p>
        </div>
      </div>
      <div className="md:col-span-3 bg-orange-600 text-white p-5 rounded flex items-center gap-5">
        <FaGamepad className="p-4 size-12 bg-orange-500 rounded-full" />
        <div>
          <p className="text-2xl font-semibold">
            {developerRevenue.toLocaleString("vi-VN")}
            <CoinIcon className="inline size-5 mb-1 ms-1" />
          </p>
          <p className="text-xs">Developer Revenue</p>
        </div>
      </div>
      <div className="md:col-span-3 bg-green-600 text-white p-5 rounded flex items-center gap-5">
        <CiBank className="p-4 size-12 bg-green-500 rounded-full" />
        <div>
          <p className="text-2xl font-semibold">
            {formatCurrencyVND(summaryData.adminBankBalance)}
          </p>
          <p className="text-xs">Money in Bank Account</p>
        </div>
      </div>
    </>
  );
};

export default DashboardSummary;
