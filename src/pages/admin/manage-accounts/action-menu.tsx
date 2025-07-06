import useUserStore from "@/store/use-user-store";
import { User } from "@/types/user";
import { Button, Dropdown, message, Modal, Input, DatePicker, Form } from "antd";
import { useState } from "react";
import { FaBan, FaCheckCircle, FaEye, FaTrash, FaEllipsisV } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { createBanHistory, unBanUserById } from "@/lib/api/user-api";
import dayjs, { Dayjs } from "dayjs";
import { formatDateTime } from "@/lib/date-n-time";

const ActionMenu = ({ record }: { record: User }) => {
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const { fetchAllAccounts } = useUserStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [banDate] = useState(dayjs());
  const [unBanDate, setUnBanDate] = useState<Dayjs | null>(null);

  const handleView = () => {
    navigate(`/admin/detail-user/${record.id}`);
  };

  const handleBanOrUnBan = async () => {
    try {
      let response;
      if (record.isActive) {
        if (!reason) {
          messageApi.error("Please enter a reason for banning.");
          return;
        }
        if (!unBanDate || unBanDate.isBefore(banDate)) {
          messageApi.error("UnBan date must be after ban date.");
          return;
        }
        const request = {
          banDate: banDate.toISOString(),
          unBanDate: unBanDate.toISOString(),
          reason,
          userId: record.id,
        };
        response = await createBanHistory(request);
      } else {
        response = await unBanUserById(record.id);
      }

      if (response.success) {
        messageApi.success(record.isActive ? "User banned successfully!" : "User unbanned successfully!");
        await fetchAllAccounts();
        setIsModalOpen(false);
        setReason("");
        setUnBanDate(null);
      } else {
        messageApi.error(response.error || "Failed to process action.");
      }
    } catch (error) {
      messageApi.error("An error occurred.");
    }
  };

  const disablePastDates = (current: Dayjs) => {
    return current && current.isBefore(banDate, "minute");
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
              onClick: handleView,
            },
            {
              key: "ban",
              label: record.isActive ? "Ban Account" : "UnBan Account",
              icon: record.isActive ? <FaBan /> : <FaCheckCircle />,
              onClick: () => {
                setReason("");
                setUnBanDate(null);
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
        title={record.isActive ? "Ban User" : "UnBan User"}
        open={isModalOpen}
        onOk={handleBanOrUnBan}
        onCancel={() => {
          setIsModalOpen(false);
          setReason("");
          setUnBanDate(null);
        }}
        okText={record.isActive ? "Ban" : "UnBan"}
        cancelText="Cancel"
      >
        {record.isActive ? (
          <Form layout="vertical">
            <Form.Item label="Reason for Banning">
              <Input.TextArea
                rows={4}
                placeholder="Enter reason for banning"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                style={{ marginBottom: 16 }}
              />
            </Form.Item>
            <Form.Item label="Ban Date and Time">
              <Input value={formatDateTime(banDate.toDate())} disabled style={{ marginBottom: 16, width: "100%" }} />
            </Form.Item>
            <Form.Item label="UnBan Date and Time">
              <DatePicker
                showTime
                placeholder="Select UnBan date and time"
                value={unBanDate}
                onChange={(date) => setUnBanDate(date)}
                disabledDate={disablePastDates}
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Form>
        ) : (
          <div className="flex items-center gap-2">
            <p>Are you sure you want to UnBan this account:</p>
            <p className="text-orange-400">{record.userName}</p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ActionMenu;
