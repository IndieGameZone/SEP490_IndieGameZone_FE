import { useEffect, useState } from "react";
import { getDevMonthStatistic } from "@/lib/api/dev-dashboard-api";
import dayjs, { Dayjs } from "dayjs";
import { DatePicker, Form } from "antd";
import DailyRevenueChart from "@/components/charts/daily-revenue-chart";
import useAuthStore from "@/store/use-auth-store";

type ChartData = {
  day: number;
  revenue: number;
  donation: number;
};

const MonthStatistic = () => {
  const [gameMonthStatistic, setGameMonthStatistic] = useState<ChartData[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<Dayjs>(dayjs());
  const { profile } = useAuthStore();

  useEffect(() => {
    fetchData(selectedMonth.month() + 1, selectedMonth.year());
  }, [selectedMonth]);

  const fetchData = async (month: number, year: number) => {
    if (!profile) return;
    const result = await getDevMonthStatistic(profile.id, month, year);
    if (!result.error) {
      setGameMonthStatistic(result.data);
    }
  };

  const monthStr = selectedMonth.format("MMMM YYYY");
  return (
    <div className="mt-5">
      <div className="flex justify-between">
        <h2 className="text-xl font-bold">Daily Statistics</h2>

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
    </div>
  );
};

export default MonthStatistic;
