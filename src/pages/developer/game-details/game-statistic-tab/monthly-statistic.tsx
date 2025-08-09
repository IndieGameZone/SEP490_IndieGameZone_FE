import { useEffect, useState } from "react";
import { getGameMonthlyStatistic } from "@/lib/api/dev-dashboard-api";
import GameRevenueChart from "./game-revenue-chart";
import GameDownloadChart from "./game-download-chart";
import dayjs, { Dayjs } from "dayjs";
import { DatePicker, Form } from "antd";

type MonthlyStatisticProps = {
  gameId: string;
};

type ChartData = {
  day: number;
  downloadCount: number;
  revenue: number;
};

const MonthlyStatistic = ({ gameId }: MonthlyStatisticProps) => {
  const [gameMonthlyStatistic, setGameMonthlyStatistic] = useState<ChartData[]>(
    []
  );
  const [selectedMonth, setSelectedMonth] = useState<Dayjs>(dayjs());

  useEffect(() => {
    fetchData(selectedMonth.month() + 1, selectedMonth.year());
  }, [selectedMonth]);

  const fetchData = async (month: number, year: number) => {
    const result = await getGameMonthlyStatistic(gameId, month, year);
    if (!result.error) {
      setGameMonthlyStatistic(result.data);
    }
  };

  return (
    <div>
      <div className="flex justify-between">
        <h2 className="text-xl font-bold">Game's Monthly Statistics</h2>
        <Form layout="inline" className="mb-4">
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
      <div className="bg-zinc-900 rounded mt-2">
        <h3 className="pt-3 -mb-3 text-center text-xl font-semibold">
          Monthly Earnings Trend
        </h3>
        <GameRevenueChart data={gameMonthlyStatistic} />
      </div>
      <div className="bg-zinc-900 rounded mt-2">
        <h3 className="pt-3 -mb-3 text-center text-xl font-semibold">
          Download Trends
        </h3>
        <GameDownloadChart data={gameMonthlyStatistic} />
      </div>
    </div>
  );
};

export default MonthlyStatistic;
