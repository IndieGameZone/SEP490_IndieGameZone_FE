import { useState } from "react";
import { Button, Card,  Typography, message } from "antd";
import { MdSummarize } from "react-icons/md";
import { AiOutlineRobot } from "react-icons/ai";
import { BiMessageSquareDetail } from "react-icons/bi";
import useGameStore from "@/store/use-game-store";
import { FaLightbulb } from "react-icons/fa";
import { getSummaryReview } from "@/lib/api/review-api";
import Loader from "@/components/loader";

const { Title, Text } = Typography;

const GameSummaryReview = () => {
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState("");
  const [hasSummary, setHasSummary] = useState(false);
  const { game } = useGameStore();
  
  const handleSummarize = async () => {
    if (!game?.id) {
      message.error("Game not found!");
      return;
    }

    setLoading(true);
    
    try {
      const result = await getSummaryReview(game.id);
      
      if (result.success && result.data) {
        setSummary(result.data.summary || "No summary available heheheheehheheheh");
        setHasSummary(true);
        message.success("Review summary generated successfully!");
      } else {
        message.error(result.error || "Failed to generate summary");
      }
    } catch (error) {
      message.error("An error occurred while generating summary");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <Title level={2} className="text-white mb-2">
            <BiMessageSquareDetail className="inline-block mr-3 text-blue-400" />
            Game Summary Review {game?.name}
          </Title>
          <Text className="text-gray-400 text-lg">AI-powered intelligent game review summarization</Text>
        </div>

        <div className="text-center mb-8">
          <Button
            type="primary"
            size="large"
            icon={<MdSummarize />}
            loading={loading}
            onClick={handleSummarize}
            className="px-8 py-3 h-auto text-lg font-semibold"
          >
            {loading ? "Summarizing..." : "Summarize Reviews"}
          </Button>
        </div>

        {(loading || hasSummary) && (
          <Card
            className="border-gray-700 mb-6"
            title={
              <span className="text-white">
                <AiOutlineRobot className="inline-block mr-2 text-green-400" />
                AI Summary Result
              </span>
            }
          >
            {loading ? (
              <div className="text-center py-8">
                <Loader/>
                <div className="mt-4">
                  <Text className="text-gray-400">AI is analyzing and summarizing reviews...</Text>
                </div>
              </div>
            ) : (
              <div className="p-6 rounded-lg">
                <div className="text-gray-300 whitespace-pre-line leading-relaxed">{summary}</div>
              </div>
            )}
          </Card>
        )}

        <Card className="border-gray-700">
          <div className="flex items-center gap-3 justify-center">
            <FaLightbulb color="yellow" /> 
            <Text className="text-gray-400">
              This feature uses AI to intelligently analyze and summarize game reviews
            </Text>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default GameSummaryReview;