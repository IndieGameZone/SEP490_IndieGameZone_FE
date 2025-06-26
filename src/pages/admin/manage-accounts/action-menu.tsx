import useUserStore from "@/store/use-user-store";
import { User } from "@/types/user";
import { Button, Dropdown, message, Modal, Input, DatePicker } from "antd";
import { useState } from "react";
import { FaBan, FaEye, FaTrash, FaEllipsisV } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { createBanHistory } from "@/lib/api/user-api";
import dayjs from "dayjs";

const ActionMenu = ({ record }: { record: User }) => {
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const { fetchAllAccounts } = useUserStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [banDate, setBanDate] = useState<dayjs.Dayjs | null>(null);
  const [unbanDate, setUnbanDate] = useState<dayjs.Dayjs | null>(null);

  const handleView = (user: User) => {
    navigate(`/admin/detail-user/${user.id}`);
  };

  const confirmBan = async () => {
    if (!reason) {
      messageApi.error("Reason is required.");
      return;
    }
    if (!banDate) {
      messageApi.error("Ban date is required.");
      return;
    }
    if (!unbanDate || unbanDate.isBefore(banDate)) {
      messageApi.error("Unban date must be after ban date.");
      return;
    }

    const request = {
      banDate: banDate.toISOString(),
      unbanDate: unbanDate.toISOString(),
      reason,
      userId: record.id,
    };

    try {
      const response = await createBanHistory(request);
      if (response.success) {
        messageApi.success("User has been banned successfully!");
        await fetchAllAccounts();
        setIsModalOpen(false);
        setReason("");
        setBanDate(null);
        setUnbanDate(null);
      } else {
        messageApi.error(response.error || "Failed to ban user.");
      }
    } catch (error) {
      messageApi.error("An unexpected error occurred while banning the user.");
    }
  };

  // Disable dates before the current date and time (04:12 PM +07, 24/06/2025)
  const disablePastDates = (current: dayjs.Dayjs) => {
    const now = dayjs().hour(16).minute(12).second(0); // 04:12 PM +07 today
    return current && current.isBefore(now, 'minute');
  };

  return (
    <div>
      {contextHolder}
      <Dropdown
        menu={{
          items: [
            {
              key: "view",
              label: "View Details",
              icon: <FaEye />,
              onClick: () => handleView(record),
            },
            {
              key: "ban",
              label: "Ban Account",
              icon: <FaBan />,
              onClick: () => {
                setReason("");
                setBanDate(null);
                setUnbanDate(null);
                setIsModalOpen(true);
              },
            },
            {
              type: "divider",
            },
            {
              key: "delete",
              label: "Delete User",
              icon: <FaTrash />,
              danger: true,
            },
          ],
        }}
        trigger={["click"]}
      >
        <Button type="text" icon={<FaEllipsisV />} />
      </Dropdown>
      <Modal
        title="Ban User"
        open={isModalOpen}
        onOk={confirmBan}
        onCancel={() => {
          setIsModalOpen(false);
          setReason("");
          setBanDate(null);
          setUnbanDate(null);
        }}
        okText="Ban"
        cancelText="Cancel"
      >
        <Input.TextArea
        rows={4}
          placeholder="Enter reason for banning"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          style={{ marginBottom: 16 }}
        />
        <DatePicker
          showTime
          placeholder="Select ban date and time"
          value={banDate}
          onChange={(date) => setBanDate(date)}
          disabledDate={disablePastDates}
          style={{ marginBottom: 16, width: "100%" }}
        />
        <DatePicker
          showTime
          placeholder="Select unban date and time"
          value={unbanDate}
          onChange={(date) => setUnbanDate(date)}
          disabledDate={(current) => !banDate || current.isBefore(banDate)}
          style={{ width: "100%" }}
        />
      </Modal>
    </div>
  );
};

export default ActionMenu;