import { useEffect, useState } from "react";
import {
  VictoryChart,
  VictoryBar,
  VictoryTheme,
  VictoryAxis,
  VictoryTooltip,
  VictoryVoronoiContainer,
} from "victory";
import { DatePicker, Form } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { getNewPlayersStatisticByYear } from "@/lib/api/admin-dashboard-api";

type ChartData = {
  month: number;
  count: number;
};

const NewPlayersByYearChart = () => {
  const [data, setData] = useState<ChartData[]>([]);
  const [selectedYear, setSelectedYear] = useState<Dayjs>(dayjs());

  const fetchData = async (year: number) => {
    const result = await getNewPlayersStatisticByYear(year);
    if (!result.error) {
      setData(result.data);
    }
  };

  useEffect(() => {
    fetchData(selectedYear.year());
  }, [selectedYear]);

  const chartData = data.map(({ month, count }) => ({
    x: month,
    y: count,
    series: `${dayjs()
      .month(month - 1)
      .format("MMMM")}\nNew Players: ${count}`,
  }));

  const yMax = Math.max(...chartData.map((d) => d.y), 0);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">New Players per Month</h2>

        <Form layout="inline">
          <Form.Item label="Select Year">
            <DatePicker
              picker="year"
              value={selectedYear}
              onChange={(date) => {
                if (date) setSelectedYear(date);
              }}
              allowClear={false}
            />
          </Form.Item>
        </Form>
      </div>

      <div className="bg-white rounded p-4">
        <VictoryChart
          theme={VictoryTheme.material}
          width={900}
          height={380}
          domainPadding={{ x: 40 }}
          domain={yMax === 0 ? { y: [0, 10] } : undefined}
          padding={{ top: 50, bottom: 50, left: 70, right: 50 }}
          containerComponent={
            <VictoryVoronoiContainer
              labels={({ datum }) => `${datum.series ?? ""}`}
              labelComponent={
                <VictoryTooltip cornerRadius={4} flyoutPadding={8} />
              }
            />
          }
        >
          <VictoryAxis
            label="Month"
            tickFormat={(t) =>
              dayjs()
                .month(t - 1)
                .format("MMMM")
            }
            style={{
              axisLabel: { padding: 30 },
              grid: { stroke: "transparent" },
            }}
          />

          <VictoryAxis
            dependentAxis
            label="New Players"
            style={{
              axisLabel: { padding: 50 },
              grid: { stroke: "#d4d4d8", strokeWidth: 1 },
            }}
          />

          <VictoryBar
            data={chartData}
            style={{ data: { fill: "#4f46e5" } }}
            barWidth={20}
          />
        </VictoryChart>
      </div>
    </div>
  );
};

export default NewPlayersByYearChart;
