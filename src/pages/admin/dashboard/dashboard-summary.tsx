import { getDashboardSummary } from "@/lib/api/admin-dashboard-api";
import { formatCurrencyVND } from "@/lib/currency";
import { useEffect, useState } from "react";
import { FaHandsHelping, FaUser } from "react-icons/fa";
import { FaGamepad } from "react-icons/fa6";
import { GoPackage } from "react-icons/go";

type Data = {
  onlineUserCount: number;
  totalUserCount: number;
  gamePurchaseRevenueByDeveloper: number;
  gamePurchaseRevenueByAdmin: number;
  commercialPackageRevenue: number;
};
const DashboardSummary = () => {
  const [summaryData, setSummaryData] = useState<Data>({
    onlineUserCount: 0,
    totalUserCount: 0,
    commercialPackageRevenue: 0,
    gamePurchaseRevenueByAdmin: 0,
    gamePurchaseRevenueByDeveloper: 0,
  });

  const fetchSummaryData = async () => {
    const result = await getDashboardSummary();
    if (!result.error) {
      setSummaryData(result.data);
    }
  };

  useEffect(() => {
    fetchSummaryData();
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
      <div className="md:col-span-3 bg-blue-600 text-white p-5 rounded flex items-center gap-5">
        <GoPackage className="p-4 size-12 bg-blue-500 rounded-full" />
        <div>
          <p className="text-2xl font-semibold">
            {formatCurrencyVND(summaryData.commercialPackageRevenue)}
          </p>
          <p className="text-xs">Commerical Revenue</p>
        </div>
      </div>
      <div className="md:col-span-3 bg-red-600 text-white p-5 rounded flex items-center gap-5">
        <FaHandsHelping className="p-4 size-12 bg-red-500 rounded-full" />
        <div>
          <p className="text-2xl font-semibold">
            {formatCurrencyVND(summaryData.gamePurchaseRevenueByAdmin)}
          </p>
          <p className="text-xs">Commission Revenue</p>
        </div>
      </div>
      <div className="md:col-span-3 bg-orange-600 text-white p-5 rounded flex items-center gap-5">
        <FaGamepad className="p-4 size-12 bg-orange-500 rounded-full" />
        <div>
          <p className="text-2xl font-semibold">
            {formatCurrencyVND(summaryData.gamePurchaseRevenueByDeveloper)}
          </p>
          <p className="text-xs">Developer Revenue</p>
        </div>
      </div>
    </>
  );
};

export default DashboardSummary;
