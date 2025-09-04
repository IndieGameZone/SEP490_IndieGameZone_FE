import CoinIcon from "@/components/coin-icon";
import { getDashboardSummary, getTotalCurrentDevRevenue } from "@/lib/api/admin-dashboard-api";
import { formatCurrencyVND } from "@/lib/currency";
import { useEffect, useState } from "react";
import { VictoryPie, VictoryLabel } from "victory";

type SummaryData = {
  gamePurchaseRevenueByDeveloper: number;
  gamePurchaseRevenueByAdmin: number;
  commercialPackageRevenue: number;
};

const DashboardSummary = () => {
  const [summaryData, setSummaryData] = useState<SummaryData>({
    gamePurchaseRevenueByDeveloper: 0,
    gamePurchaseRevenueByAdmin: 0,
    commercialPackageRevenue: 0,
  });
  const [developerRevenue, setDeveloperRevenue] = useState<number>(0);
  const fetchData = async () => {
    const result = await getDashboardSummary();
    if (result.error) {
      // Handle error
    } else {
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
    fetchData();
    fetchDeveloperCurrentRevenue();
  }, []);

  // Prepare data for pie chart
  const pieData = [
    {
      x: "Developer Revenue",
      y: summaryData.gamePurchaseRevenueByDeveloper,
      color: "#3B82F6",
    },
    {
      x: "Comission Revenue",
      y: summaryData.gamePurchaseRevenueByAdmin,
      color: "#10B981",
    },
    {
      x: "Commercial Packages",
      y: summaryData.commercialPackageRevenue,
      color: "#F59E0B",
    },
  ].filter((item) => item.y > 0);

  return (
    <div className="grid grid-cols-3 gap-6 mb-5">
      <div className="flex flex-col gap-3">
        {/* Developer Revenue Card */}
        <div className="bg-white rounded shadow-md border border-zinc-200 px-3 py-5">
          <div className="flex items-center justify-between border-s-4 border-blue-500 ps-4">
            <div>
              <h3 className="text-sm font-medium text-gray-600 mb-2">Total Developer Revenue</h3>
              <p className="text-2xl font-semibold text-blue-600 flex items-center gap-1">
                {developerRevenue.toLocaleString("vi-VN")}
                <CoinIcon className="inline size-5 " />
              </p>
            </div>
          </div>
        </div>

        {/* Platform Revenue Card */}
        <div className="bg-white rounded shadow-md border border-zinc-200 px-3 py-5">
          <div className="flex items-center justify-between border-s-4 border-green-500 ps-4">
            <div>
              <h3 className="text-sm font-medium text-gray-600 mb-2">Total Comission Revenue</h3>
              <p className="text-2xl font-semibold text-green-600 flex items-center gap-1">
                {(summaryData.gamePurchaseRevenueByAdmin ?? 0).toLocaleString("vi-VN")}
                <CoinIcon className="inline size-5 " />
              </p>
            </div>
          </div>
        </div>

        {/* Commercial Packages Card */}
        <div className="bg-white rounded shadow-md border border-zinc-200 px-3 py-5">
          <div className="flex items-center justify-between border-s-4 border-amber-500 ps-4">
            <div>
              <h3 className="text-sm font-medium text-gray-600 mb-2">Commercial Packages Revenue</h3>
              <p className="text-2xl font-semibold text-amber-600 flex items-center gap-1">
                {(summaryData.commercialPackageRevenue ?? 0).toLocaleString("vi-VN")}
                <CoinIcon className="inline size-5 " />
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Revenue Distribution Pie Chart */}
      <div className="bg-white rounded shadow-md border border-zinc-200 p-6 col-span-2">
        <h3 className="text-lg font-medium text-gray-600 mb-4 text-center">Revenue Distribution</h3>
        {pieData.length > 0 ? (
          <svg viewBox="0 0 600 220" width={600} height={220}>
            <VictoryPie
              standalone={false}
              data={pieData}
              width={600}
              padding={{ top: 20, bottom: 10 }}
              height={220}
              innerRadius={40}
              padAngle={2}
              colorScale={pieData.map((d) => d.color)}
              labelComponent={
                <VictoryLabel
                  style={{
                    fill: "gray",
                    fontSize: 12,
                  }}
                />
              }
              animate={{
                duration: 1000,
                onLoad: { duration: 500 },
              }}
            />
            <VictoryLabel
              textAnchor="middle"
              style={{ fontSize: 20 }}
              x={300}
              y={115}
              text={formatCurrencyVND(
                summaryData.commercialPackageRevenue +
                  summaryData.gamePurchaseRevenueByAdmin +
                  summaryData.gamePurchaseRevenueByDeveloper
              )}
            />
          </svg>
        ) : (
          <div className="flex items-center justify-center h-40 text-zinc-500">
            <p>No data available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardSummary;
