import { Button, Dropdown, message, Modal, Input, DatePicker, Form } from "antd";
import { useState } from "react";
import {  FaEye,  FaEllipsisV } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import dayjs, { Dayjs } from "dayjs";
import useAuthStore from "@/store/use-auth-store";
import { Withdraw } from "@/types/withdraw-request";
import { FcApproval, FcCancel } from "react-icons/fc";

const ActionMenu = ({ record }: { record: Withdraw }) => {
  const [messageApi, contextHolder] = message.useMessage();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [banDate] = useState(dayjs());
  const [unBanDate, setUnBanDate] = useState<Dayjs | null>(null);
  const { profile } = useAuthStore();



  
  return (
    <div>
      {contextHolder}
      <Dropdown
        menu={{
          items: [
            {
              key: "approve",
              label: <span className="text-green-400">Approval</span> ,
              icon: <FcApproval  />,
            },
            {
              key: "rejected",
              label: <span className="text-red-400">Rejection</span>,
              icon: <FcCancel />,
            },
            
          ],
        }}
        trigger={["click"]}
      >
        <Button type="text" icon={<FaEllipsisV />} />
      </Dropdown>

      
    </div>
  );
};

export default ActionMenu;
