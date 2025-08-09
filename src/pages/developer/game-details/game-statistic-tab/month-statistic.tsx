import { useEffect, useState } from "react";
import { getGameMonthStatistic } from "@/lib/api/dev-dashboard-api";
import DailyRevenueChart from "./daily-revenue-chart";
import DailyDownloadChart from "./daily-download-chart";
import dayjs, { Dayjs } from "dayjs";
import { DatePicker, Form } from "antd";

type MonthStatisticProps = {
  gameId: string;
};

type ChartData = {
  day: number;
  downloadCount: number;
  revenue: number;
};

const MonthStatistic = ({ gameId }: MonthStatisticProps) => {
  const [gameMonthStatistic, setGameMonthStatistic] = useState<ChartData[]>(
    []
  );
  const [selectedMonth, setSelectedMonth] = useState<Dayjs>(dayjs());

  useEffect(() => {
    fetchData(selectedMonth.month() + 1, selectedMonth.year());
  }, [selectedMonth]);

  const fetchData = async (month: number, year: number) => {
    const result = await getGameMonthStatistic(gameId, month, year);
    if (!result.error) {
      setGameMonthStatistic(result.data);
    }
  };

  const monthStr = selectedMonth.format("MMMM YYYY");
  return (
    <div className="mt-5">
      <div className="flex justify-between">
        <h2 className="text-xl font-bold">Game's Daily Statistics</h2>
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
          Earnings Trend ({monthStr})
        </h3>
        <DailyRevenueChart data={gameMonthStatistic} />
      </div>
      <div className="bg-zinc-900 rounded mt-2">
        <h3 className="pt-3 -mb-3 text-center text-xl font-semibold">
          Download Trends ({monthStr})
        </h3>
        <DailyDownloadChart data={gameMonthStatistic} />
      </div>
    </div>
  );
};

export default MonthStatistic;
