import { Button, Dropdown } from "antd";
import { useState } from "react";
import { FaEye, FaEllipsisV } from "react-icons/fa";
import { Transaction } from "@/types/transaction";
import ViewDetailTransactionsModal from "./transaction-detail-modal";

interface ActionMenuProps {
  record: Transaction;
  onSuccess?: () => void;
}

const ActionMenu = ({ record }: ActionMenuProps) => {
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const handleMenuClick = (key: string) => {
    if (key === "view") {
      setIsViewModalOpen(true);
    }
  };

  const handleViewModalCancel = () => {
    setIsViewModalOpen(false);
  };

  return (
    <>
      <Dropdown
        menu={{
          items: [
            {
              key: "view",
              label: <span className="text-blue-400">View Details</span>,
              icon: <FaEye />,
              onClick: () => handleMenuClick("view"),
            },
          ],
        }}
        trigger={["click"]}
      >
        <Button type="text" icon={<FaEllipsisV />} />
      </Dropdown>

      <ViewDetailTransactionsModal
        open={isViewModalOpen}
        record={record}
        onCancel={handleViewModalCancel}
      />
    </>
  );
};

export default ActionMenu;
