import {
  VictoryAxis,
  VictoryChart,
  VictoryLine,
  VictoryTheme,
  VictoryTooltip,
  VictoryVoronoiContainer,
} from "victory";

export interface GameData {
  day: number;
  downloadCount: number;
}

interface Props {
  data: GameData[];
}

const GameDownloadChart = ({ data }: Props) => {
  const yValues = data.map((d) => d.downloadCount);
  const yMax = Math.max(...yValues);
  
  return (
    <VictoryChart
      width={900}
      height={300}
      theme={VictoryTheme.material}
      domainPadding={20}
      domain={yMax == 0 ? { y: [0, 10] } : undefined}
      containerComponent={
        <VictoryVoronoiContainer
          labels={({ datum }) =>
            `Day ${datum.day}: ${datum.downloadCount} download(s)`
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
          axisLabel: { padding: 30, fill: "white" },
          tickLabels: { fill: "white" },
        }}
      />

      <VictoryAxis
        dependentAxis
        label="Num of Downloads"
        style={{
          axisLabel: { padding: 50, fill: "white" },
          tickLabels: { fill: "white" },
        }}
      />

      <VictoryLine
        data={data}
        x="day"
        y="downloadCount"
        interpolation="monotoneX"
        style={{
          data: { stroke: "#67e8f9", strokeWidth: 3 },
        }}
      />
    </VictoryChart>
  );
};

export default GameDownloadChart;
