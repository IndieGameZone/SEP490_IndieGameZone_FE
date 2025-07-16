import { Transaction } from "@/types/transaction";
import { Button, message } from "antd";
import { FaDownload, FaEye } from "react-icons/fa";

const ActionMenu = ({ record }: { record: Transaction }) => {
  const [messageApi, contextHolder] = message.useMessage();
  return (
    <div className="flex justify-center gap-2">
      {contextHolder}
      <Button
        type="text"
        icon={<FaEye className="text-blue-400" />}
        onClick={() => messageApi.info(`Viewing details for ${record.id}`)}
      />
      <Button
        type="text"
        icon={<FaDownload className="text-green-400" />}
        onClick={() => messageApi.info(`Downloading receipt for ${record.id}`)}
      />
    </div>
  );
};

export default ActionMenu;
