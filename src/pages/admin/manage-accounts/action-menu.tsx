import useUserStore from "@/store/use-user-store";
import { User } from "@/types/user";
import { Button, Dropdown, message, Modal, Input, DatePicker } from "antd";
import { useState, useEffect } from "react";
import { FaBan, FaCheckCircle, FaEye, FaTrash, FaEllipsisV } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { createBanHistory, getAllBanHistories, unbanUserById } from "@/lib/api/user-api";
import dayjs from "dayjs";

const ActionMenu = ({ record }: { record: User }) => {
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const { fetchAllAccounts } = useUserStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [banDate, setBanDate] = useState<dayjs.Dayjs | null>(null);
  const [unbanDate, setUnbanDate] = useState<dayjs.Dayjs | null>(null);
  const [banHistoryId, setBanHistoryId] = useState<string | null>(null);

  useEffect(() => {
    const fetchBanHistory = async () => {
      const response = await getAllBanHistories();
      if (response.success) {
        const userBanHistory = response.data.find((history: any) => history.userId === record.id);
        if (userBanHistory) {
          setBanHistoryId(userBanHistory.id);
        }
      }
    };
    if (!record.isActive && !banHistoryId) {
      fetchBanHistory();
    }
  }, [record.id, record.isActive, banHistoryId]);

  const handleView = (user: User) => {
    navigate(`/admin/detail-user/${user.id}`);
  };

  const confirmBan = async () => {
    try {
      let response;
      if (record.isActive) {
        // Ban action
        if (!reason) {
          messageApi.error("Reason is required for banning.");
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
        response = await createBanHistory(request);
      } else {
        // Unban action
        if (!banHistoryId) {
          messageApi.error("No active ban history found for this user.");
          return;
        }
        response = await unbanUserById(banHistoryId);
      }

      if (response.success) {
        messageApi.success(
          record.isActive
            ? "User has been banned successfully!"
            : "User has been unbanned successfully!"
        );
        await fetchAllAccounts();
        setIsModalOpen(false);
        setReason("");
        setBanDate(null);
        setUnbanDate(null);
        setBanHistoryId(null); // Reset ban history ID after unban
      } else {
        messageApi.error(response.error || "Failed to process action.");
      }
    } catch (error) {
      messageApi.error("An unexpected error occurred.");
    }
  };

  const disablePastDates = (current: dayjs.Dayjs) => {
    const now = dayjs().hour(20).minute(33).second(0); // Current time: 08:33 PM +07, June 26, 2025
    return current && current.isBefore(now, "minute");
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
              label: record.isActive ? "Ban Account" : "Unban Account",
              icon: record.isActive ? <FaBan /> : <FaCheckCircle />,
              onClick: () => {
                setReason("");
                setBanDate(null);
                setUnbanDate(null);
                setIsModalOpen(true);
              },
              disabled: !record.isActive && !banHistoryId, 
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
        title={record.isActive ? "Ban User" : "Unban User"}
        open={isModalOpen}
        onOk={confirmBan}
        onCancel={() => {
          setIsModalOpen(false);
          setReason("");
          setBanDate(null);
          setUnbanDate(null);
        }}
        okText={record.isActive ? "Ban" : "Unban"}
        cancelText="Cancel"
      >
        {record.isActive ? (
          <>
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
          </>
        ) : (
          <p>No additional input required for unbanning.</p>
        )}
      </Modal>
    </div>
  );
};

export default ActionMenu;
