import { getAdminRevenueStatisticByMonth } from "@/lib/api/admin-dashboard-api";
import { formatCurrencyVND } from "@/lib/currency";
import { DatePicker, Form } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { useEffect, useState } from "react";
import {
  VictoryChart,
  VictoryLine,
  VictoryTheme,
  VictoryAxis,
  VictoryVoronoiContainer,
  VictoryTooltip,
} from "victory";

type ChartData = {
  day: number;
  commercialRevenue: number;
  gameRevenue: number;
};

const RevenueByMonthChart = () => {
  const [data, setData] = useState<ChartData[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<Dayjs>(dayjs());

  const fetchData = async (month: number, year: number) => {
    const result = await getAdminRevenueStatisticByMonth(month, year);
    if (!result.error) {
      setData(result.data);
    }
  };

  useEffect(() => {
    fetchData(selectedMonth.month() + 1, selectedMonth.year());
  }, [selectedMonth]);

  const commercialRevenueData = data.map(({ day, commercialRevenue }) => ({
    x: day,
    y: commercialRevenue,
    series: "Commercial package revenue",
  }));
  const commissionRevenueData = data.map(({ day, gameRevenue }) => ({
    x: day,
    y: gameRevenue,
    series: "Commission revenue",
  }));

  const yMax = Math.max(
    ...commercialRevenueData.map((d) => d.y),
    ...commissionRevenueData.map((d) => d.y) 
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Revenue per Day</h2>

        <Form layout="inline">
          <Form.Item label="Select Month">
            <DatePicker
              picker="month"
              value={selectedMonth}
              onChange={(date) => {
                if (date) setSelectedMonth(date);
              }}
              allowClear={false}
            />
          </Form.Item>
        </Form>
      </div>

      {/* Custom Legend outside of VictoryChart */}
      <div className="bg-white rounded p-4">
        <div className="flex justify-center mb-4">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-4 h-0.5 bg-red-500"></div>
              <span className="text-sm">Commercial Revenue</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-0.5 bg-blue-500"></div>
              <span className="text-sm">Commission Revenue</span>
            </div>
          </div>
        </div>

        <VictoryChart
          theme={VictoryTheme.material}
          width={900}
          height={380}
          domainPadding={20}
          domain={yMax == 0 ? { y: [0, 100_000] } : undefined}
          padding={{ top: 50, bottom: 50, left: 70, right: 70 }}
          containerComponent={
            <VictoryVoronoiContainer
              labels={({ datum }) =>
                `Day ${datum.x}\n${datum.series ?? ""}: ${formatCurrencyVND(
                  datum.y
                )}`
              }
              labelComponent={
                <VictoryTooltip cornerRadius={4} flyoutPadding={8} />
              }
            />
          }
        >
          <VictoryAxis
            label="Day of Month"
            tickFormat={(t) => `${t}`}
            style={{
              axisLabel: { padding: 30 },
              grid: { stroke: "transparent" },
            }}
          />

          <VictoryAxis
            dependentAxis
            label="Revenue (₫)"
            style={{
              axisLabel: { padding: 50 },
              grid: {
                stroke: "#d4d4d8",
                strokeWidth: 1,
                strokeDasharray: "0",
              },
              tickLabels: { angle: -45, textAnchor: "end" },
            }}
          />

          <VictoryLine
            style={{
              data: { stroke: "tomato" },
            }}
            data={commercialRevenueData}
            interpolation="monotoneX"
          />

          <VictoryLine
            style={{ data: { stroke: "blue" } }}
            data={commissionRevenueData}
            interpolation="monotoneX"
          />
        </VictoryChart>
      </div>
    </div>
  );
};

export default RevenueByMonthChart;
