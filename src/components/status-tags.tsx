import { Category } from "@/types/category";
import { GameCensorStatus, GameVisibility } from "@/types/game";
import { Badge, Tag } from "antd";
import { LuBrainCircuit } from "react-icons/lu";

type ModerationStatusProps = {
  status: GameCensorStatus;
};

export const VisibilityStatus = ({ status }: { status: GameVisibility }) => {
  const badgeStatus =
    status === "Draft"
      ? "default"
      : status === "Public"
      ? "success"
      : status === "Restricted"
      ? "warning"
      : "error";
  return <Badge status={badgeStatus} text={status} />;
};

export const AITag = () => {
  return (
    <Tag icon={<LuBrainCircuit className="inline me-1" />} color="#55acee">
      AI
    </Tag>
  );
};

const moderationStatusBadgeMap = {
  Approved: { badgeStatus: "success", label: "Approved" },
  Rejected: { badgeStatus: "error", label: "Rejected" },
  PendingAIReview: { badgeStatus: "processing", label: "Pending review by AI" },
  PendingManualReview: {
    badgeStatus: "warning",
    label: "Pending review by moderators",
  },
} as const;

export const ModerationStatusBadge = ({ status }: ModerationStatusProps) => {
  const { badgeStatus, label } = moderationStatusBadgeMap[status] || {
    badgeStatus: "default",
    label: status,
  };

  return <Badge status={badgeStatus} text={label} />;
};

const antdTagColors = [
  "magenta",
  "red",
  "volcano",
  "orange",
  "gold",
  "lime",
  "green",
  "cyan",
  "blue",
  "geekblue",
  "purple",
];

const getCategoryColor = (() => {
  const colors: { [key: string]: string } = {};

  const getRandomAntdColor = (): string => {
    const randomIndex = Math.floor(Math.random() * antdTagColors.length);
    return antdTagColors[randomIndex];
  };

  return (category: string): string => {
    if (colors[category]) {
      return colors[category];
    }
    const newColor = getRandomAntdColor();
    colors[category] = newColor;
    return newColor;
  };
})();

export const CategoryTag = ({ category }: { category?: Category }) => {
  return (
    <Tag
      color={getCategoryColor(category?.name || "Unknown")}
      style={{ marginInlineEnd: 0 }}
    >
      {category?.name || "Unknown"}
    </Tag>
  );
};

const moderationStatusTagConfig = {
  Approved: { color: "green", text: "Approved" },
  PendingManualReview: { color: "orange", text: "Pending Review" },
  PendingAiReview: { color: "blue", text: "Pending AI Review" },
  Rejected: { color: "red", text: "Rejected" },
};

export const ModerationStatusTag = ({ status }: ModerationStatusProps) => {
  const config =
    moderationStatusTagConfig[
      status as keyof typeof moderationStatusTagConfig
    ] || moderationStatusTagConfig.PendingManualReview;
  return (
    <Tag color={config.color} className="font-medium">
      {config.text}
    </Tag>
  );
};
