import { Badge } from "antd";

const VisibilityStatus = ({
  status,
}: {
  status: "Draft" | "Restricted" | "Public";
}) => {
  return (
    <Badge
      status={
        status == "Draft"
          ? "default"
          : status == "Public"
          ? "success"
          : status == "Restricted"
          ? "warning"
          : "error"
      }
      text={status}
    />
  );
};

export default VisibilityStatus;
