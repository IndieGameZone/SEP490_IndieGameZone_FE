import { formatCurrencyVND } from "@/lib/currency";
import {
  VictoryChart,
  VictoryBar,
  VictoryTheme,
  VictoryAxis,
  VictoryTooltip,
} from "victory";

type RevenueData = {
  [month: string]: number;
};

interface Props {
  revenueByMonth: RevenueData;
  year: number;
}

const MonthlyRevenueChart = ({ revenueByMonth, year }: Props) => {
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  var yMax = 0;

  const filledData = monthNames.map((name, idx) => {
    const monthNum = String(idx + 1).padStart(2, "0");
    const key = `${year}-${monthNum}`;
    const revenue = revenueByMonth[key] ?? 0;
    if (revenue > yMax) yMax = revenue;
    return {
      x: `${name} ${year}`,
      y: revenue,
      label: formatCurrencyVND(revenue),
    };
  });

  return (
    <VictoryChart
      theme={VictoryTheme.material}
      domainPadding={20}
      width={900}
      height={350}
      padding={{ top: 20, bottom: 70, left: 70, right: 70 }}
      domain={yMax == 0 ? { y: [0, 100000] } : undefined}
    >
      <VictoryAxis
        label="Month of Year"
        style={{
          tickLabels: { fontSize: 12, angle: -45, padding: 15, fill: "white" },
          grid: { stroke: "transparent" },
          axisLabel: { padding: 50, fill: "white" },
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
      <VictoryBar
        data={filledData}
        labels={({ datum }) => datum.label}
        labelComponent={<VictoryTooltip />}
        style={{
          data: { fill: "#4f46e5" },
        }}
      />
    </VictoryChart>
  );
};

export default MonthlyRevenueChart;
