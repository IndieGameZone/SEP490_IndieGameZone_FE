import {
  VictoryBar,
  VictoryChart,
  VictoryAxis,
  VictoryTheme,
  VictoryLabel,
} from "victory";

const ratingData = [
  { rating: "1", percentage: 5 },
  { rating: "2", percentage: 10 },
  { rating: "3", percentage: 20 },
  { rating: "4", percentage: 35 },
  { rating: "5", percentage: 30 },
];

const RatingChart = () => {
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
            data={ratingData}
            x="rating"
            y="percentage"
            horizontal
            barWidth={20}
            labels={({ datum }) => `${datum.percentage}%`}
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
