import { formatCurrencyVND } from "@/lib/currency";
import {
  VictoryChart,
  VictoryLine,
  VictoryAxis,
  VictoryTheme,
  VictoryTooltip,
  VictoryVoronoiContainer,
} from "victory";

export interface GameData {
  day: number;
  revenue: number;
}

interface Props {
  data: GameData[];
}

const DailyRevenueChart = ({ data }: Props) => {
  const yValues = data.map((d) => d.revenue);
  const yMax = Math.max(...yValues);

  return (
    <VictoryChart
      width={900}
      height={300}
      theme={VictoryTheme.material}
      domainPadding={20}
      domain={yMax == 0 ? { y: [0, 100000] } : undefined}
      containerComponent={
        <VictoryVoronoiContainer
          labels={({ datum }) =>
            `Day ${datum.day}: ${formatCurrencyVND(datum.revenue)}`
          }
          labelComponent={<VictoryTooltip cornerRadius={4} flyoutPadding={8} />}
        />
      }
      padding={{ top: 20, bottom: 50, left: 70, right: 70 }}
    >
      <VictoryAxis
        label="Day of Month"
        tickFormat={(t) => `${t}`}
        style={{
          grid: { stroke: "transparent" },
          axisLabel: { padding: 30, fill: "white" },
          tickLabels: { fill: "white" },
        }}
      />

      <VictoryAxis
        dependentAxis
        label="Revenue (₫)"
        style={{
          grid: {
            stroke: "#3f3f46",
            strokeWidth: 1,
            strokeDasharray: "0",
          },
          axisLabel: { padding: 50, fill: "white" },
          tickLabels: { fill: "white", angle: -45, textAnchor: "end" },
        }}
      />

      <VictoryLine
        data={data}
        x="day"
        y="revenue"
        interpolation="monotoneX"
        style={{
          data: { stroke: "#fcd34d", strokeWidth: 3 },
        }}
      />
    </VictoryChart>
  );
};

export default DailyRevenueChart;
