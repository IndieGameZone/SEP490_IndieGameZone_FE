import { Tag } from "antd";
import { LuBrainCircuit } from "react-icons/lu";

const AITag = () => {
  return (
    <Tag icon={<LuBrainCircuit className="inline me-1" />} color="#55acee">
      AI
    </Tag>
  );
};

export default AITag;
