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
  donation: number;
}

interface Props {
  data: GameData[];
}

const DailyRevenueChart = ({ data }: Props) => {
  const revenueData = data.map(({ day, revenue }) => ({ day, value: revenue, series: "Revenue" }));
  const donationData = data.map(({ day, donation }) => ({
    day,
    value: donation,
    series: "Donation"
  }));

  const yMax = Math.max(
    ...revenueData.map((d) => d.value),
    ...donationData.map((d) => d.value)
  );
  return (
    <div className="relative">
      <VictoryChart
        width={900}
        height={380}
        theme={VictoryTheme.material}
        domainPadding={20}
        domain={yMax == 0 ? { y: [0, 100000] } : undefined}
        containerComponent={
          <VictoryVoronoiContainer
            labels={({ datum }) =>
              `Day ${datum.day}\n${datum.series}: ${formatCurrencyVND(
                datum.value
              )}`
            }
            labelComponent={
              <VictoryTooltip cornerRadius={4} flyoutPadding={8} />
            }
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
          data={revenueData}
          x="day"
          y="value"
          interpolation="monotoneX"
          style={{
            data: { stroke: "#fcd34d", strokeWidth: 3 },
          }}
          // labels={({ datum }) =>
          //   `Day ${datum.day}\nRevenue: ${formatCurrencyVND(datum.value)}`
          // }
          // labelComponent={<VictoryTooltip cornerRadius={4} flyoutPadding={8} />}
        />
        <VictoryLine
          data={donationData}
          x="day"
          y="value"
          interpolation="monotoneX"
          style={{
            data: { stroke: "#6ee7b7", strokeWidth: 3 },
          }}
          // labels={({ datum }) =>
          //   `Day ${datum.day}\nDonation: ${formatCurrencyVND(datum.value)}`
          // }
          // labelComponent={<VictoryTooltip cornerRadius={4} flyoutPadding={8} />}
        />
      </VictoryChart>
      <div className="flex absolute top-[60px] right-[125px] gap-2 flex-col">
        <div className="flex items-center gap-2">
          <div
            className="w-5 h-2 rounded"
            style={{
              backgroundColor: "#fcd34d",
            }}
          />
          <span className="text-sm">Revenue</span>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="w-5 h-2 rounded"
            style={{
              backgroundColor: "#6ee7b7",
            }}
          />
          <span className="text-sm">Donation</span>
        </div>
      </div>
    </div>
  );
};

export default DailyRevenueChart;
