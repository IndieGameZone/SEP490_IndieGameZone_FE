import { Badge } from "antd";

const ModerationStatus = ({
  status,
}: {
  status: "Approved" | "Rejected" | "PendingAIReview" | "PendingManualReview";
}) => {
  return (
    <Badge
      status={
        status == "Approved"
          ? "success"
          : status == "PendingAIReview"
          ? "processing"
          : status == "PendingManualReview"
          ? "warning"
          : status == "Rejected"
          ? "error"
          : "default"
      }
      text={
        status == "Approved"
          ? "Approved"
          : status == "PendingAIReview"
          ? "Pending review by AI"
          : status == "PendingManualReview"
          ? "Pending review by moderators"
          : status == "Rejected"
          ? "Rejected"
          : status
      }
    />
  );
};

export default ModerationStatus;
