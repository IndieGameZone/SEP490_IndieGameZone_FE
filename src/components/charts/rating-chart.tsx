import {
  VictoryBar,
  VictoryChart,
  VictoryAxis,
  VictoryTheme,
  VictoryLabel,
} from "victory";

export type RatingChartData = {
  rating: number;
  percentage: number;
};

type RatingChartProps = {
  data: RatingChartData[];
};

const RatingChart = ({ data }: RatingChartProps) => {
  var maxPercentage = 0;
  data.forEach((rating) => {
    if (rating.percentage > maxPercentage) {
      maxPercentage = rating.percentage;
    }
  });

  return (
    <div className="p-2 bg-zinc-800 rounded">
      <h4 className="text-lg font-bold mb-4 text-center">
        Player Rating Distribution
      </h4>
      <div className="-mt-12">
        <VictoryChart
          theme={VictoryTheme.clean}
          domainPadding={20}
          height={300}
          domain={maxPercentage == 0 ? { y: [0, 30] } : undefined}
        >
          <VictoryAxis
            tickValues={["1", "2", "3", "4", "5"]}
            style={{
              tickLabels: {
                fontSize: 15,
                padding: 5,
                fill: "#fff",
              },
            }}
            tickFormat={(x) => `${x}★`}
          />
          <VictoryAxis
            dependentAxis
            tickFormat={(x) => `${x}%`}
            style={{ tickLabels: { fill: "#fff" } }}
          />
          <VictoryBar
            data={data}
            x="rating"
            y="percentage"
            horizontal
            barWidth={20}
            labels={({ datum }) => `${datum.percentage.toFixed(1)}%`}
            labelComponent={<VictoryLabel />}
            style={{
              data: { fill: "#FF4F0F" },
              labels: { fontSize: 12, fill: "#FFF" },
            }}
          />
        </VictoryChart>
      </div>
    </div>
  );
};

export default RatingChart;
