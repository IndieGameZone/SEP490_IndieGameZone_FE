import { useState, useEffect } from "react";
import { Button, Typography, Skeleton } from "antd"; // still using AntD Button & Skeleton
import useGameStore from "@/store/use-game-store";
import { getSummaryReview } from "@/lib/api/review-api";
import TypewriterText from "@/components/type-writer-text";
import { FaArrowRotateLeft } from "react-icons/fa6";
import { LuBrainCircuit } from "react-icons/lu";
import { useGlobalMessage } from "@/components/message-provider";

const { Title, Text } = Typography;

const STORAGE_KEY_PREFIX = "game-summary-";

const GameReviewsSummary = () => {
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState("");
  const [hasSummary, setHasSummary] = useState(false);
  const [fromLocalStorage, setFromLocalStorage] = useState(false);
  const { game } = useGameStore();
  const message = useGlobalMessage();

  useEffect(() => {
    if (game?.id) {
      const savedSummary = localStorage.getItem(
        `${STORAGE_KEY_PREFIX}${game.id}`
      );
      if (savedSummary) {
        setSummary(savedSummary);
        setHasSummary(true);
        setFromLocalStorage(true);
      }
    }
  }, [game?.id]);

  const fetchSummary = async () => {
    if (!game?.id) {
      message.error("Game not found!");
      return;
    }

    setLoading(true);
    setFromLocalStorage(false);

    try {
      const result = await getSummaryReview(game.id);

      if (result.success && result.data) {
        setSummary(result.data || "No summary available");
        setHasSummary(true);
        localStorage.setItem(`${STORAGE_KEY_PREFIX}${game.id}`, result.data);
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
    <div>
      <div className="max-w-4xl mx-auto">
        {/* Title */}
        <div className="text-center">
          <Title level={2} className="text-white">
            Game Summary Review {game?.name}
          </Title>
          <Text className="text-gray-400">
            AI-powered intelligent game review summarization
          </Text>
        </div>

        {/* Summarize button */}
        <div className="text-center mb-5">
          {!hasSummary && (
            <Button
              type="primary"
              size="large"
              icon={<LuBrainCircuit />}
              loading={loading}
              onClick={() => fetchSummary()}
              style={{ marginTop: 15 }}
            >
              {loading ? "Summarizing..." : "Summarize Reviews"}
            </Button>
          )}
        </div>

        {(loading || hasSummary) && (
          <div className="bg-gradient-to-r from-orange-600 to-orange-500 p-0.5 rounded overflow-hidden">
            <div className="bg-zinc-800 rounded shadow-md">
              {/* Header */}
              <div className="flex justify-between items-center py-3 px-5 bg-gradient-to-r from-orange-600 to-orange-500">
                <span className="text-white font-semibold text-lg flex items-center gap-2">
                  <LuBrainCircuit />
                  AI Summary Result
                </span>
                {hasSummary && (
                  <Button
                    type="default"
                    onClick={() => fetchSummary()}
                    className="px-6 py-3 h-auto text-lg font-semibold"
                    icon={<FaArrowRotateLeft />}
                    loading={loading}
                  >
                    New Summary
                  </Button>
                )}
              </div>

              {/* Content */}
              <div className="text-gray-200 py-3 px-5">
                {loading ? (
                  <Skeleton
                    active
                    paragraph={{
                      rows: 4,
                      width: ["100%", "90%", "85%", "70%"],
                    }}
                    title={{ width: "80%" }}
                    className="mb-4"
                  />
                ) : (
                  <TypewriterText
                    text={summary}
                    speed={25}
                    instant={fromLocalStorage}
                  />
                )}
              </div>
            </div>
          </div>
        )}

        {/* Footer note */}
        <div className="mt-2 mb-5">
          <div className="flex items-center gap-3 justify-center">
            <Text className="italic text-gray-400">
              This feature uses AI to intelligently analyze and summarize game
              reviews
            </Text>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameReviewsSummary;
