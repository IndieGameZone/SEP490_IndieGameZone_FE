import { Button, Dropdown } from "antd";
import { useState } from "react";
import { FaEllipsisV } from "react-icons/fa";
import { FcApproval, FcCancel } from "react-icons/fc";
import { Withdraw } from "@/types/withdraw-request";
import WithdrawActionModal from "./withdraw-modal";

interface ActionMenuProps {
  record: Withdraw;
  onSuccess?: () => void;
}

const ActionMenu = ({ record, onSuccess }: ActionMenuProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionType, setActionType] = useState<"approve" | "reject">("approve");

  const handleMenuClick = (key: string) => {
    if (key === "approve") {
      setActionType("approve");
    } else if (key === "reject") {
      setActionType("reject");
    }
    setIsModalOpen(true);
  };

  const handleModalCancel = () => {
    setIsModalOpen(false);
  };

  const handleModalSuccess = () => {
    setIsModalOpen(false);
    onSuccess?.();
  };

  return (
    <div>
       <Dropdown
        menu={{
          items: 
            record.status === "Pending"
              ? [
                  {
                    key: "approve",
                    label: <span className="text-green-400">Approval</span>,
                    icon: <FcApproval />,
                    onClick: () => handleMenuClick("approve"),
                  },
                  {
                    key: "reject",
                    label: <span className="text-red-400">Rejection</span>,
                    icon: <FcCancel />,
                    onClick: () => handleMenuClick("reject"),
                  },
                ]
              : [],
        }}
        trigger={["click"]}
      >
        <Button type="text" icon={<FaEllipsisV />} />
      </Dropdown>

      <WithdrawActionModal
        open={isModalOpen}
        actionType={actionType}
        record={record}
        onCancel={handleModalCancel}
        onSuccess={handleModalSuccess}
      />
    </div>
  );
};

export default ActionMenu;
