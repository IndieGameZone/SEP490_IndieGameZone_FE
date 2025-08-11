import { Button, Popover } from "antd";
import { useState } from "react";
import { IoIosNotifications } from "react-icons/io";
import NotificationsList from "./notifications-list";

const ViewNotificationsButton = () => {
  const [open, setOpen] = useState(false);

  return (
    <Popover
      content={<NotificationsList />}
      title={<h2 className="font-bold">Notifications</h2>}
      trigger="click"
      open={open}
      onOpenChange={setOpen}
    >
      <Button shape="circle" icon={<IoIosNotifications />} />
    </Popover>
  );
};

export default ViewNotificationsButton;
