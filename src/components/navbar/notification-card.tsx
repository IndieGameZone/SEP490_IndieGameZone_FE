import { markNotification } from "@/lib/api/notification-api";
import useNotificationStore from "@/store/use-notification-store";
import { Notification } from "@/types/notification";
import { Button } from "antd";
import { useState } from "react";
import { FaCheck } from "react-icons/fa";

interface NotificationCardProps {
  notification: Notification;
}
const NotificationCard = ({ notification }: NotificationCardProps) => {
  const { markAsRead } = useNotificationStore();
  const [isLoading, setIsLoading] = useState(false);

  const handleMarkNotification = async (notifId: string) => {
    setIsLoading(true);
    const result = await markNotification(notifId);
    setIsLoading(false);
    if (!result.error) {
      markAsRead(notifId);
    }
  };
  
  return (
    <div className={`p-2 hover:bg-zinc-800 rounded duration-300`}>
      <p
        className={`${notification.isRead ? "" : "font-bold text-orange-500"}`}
      >
        {notification.message}
      </p>
      <div className="flex justify-between">
        <em className="text-zinc-400">
          {new Date().toLocaleTimeString()} - {new Date().toLocaleDateString()}
        </em>
        <div>
          {!notification.isRead && (
            <Button
              size="small"
              shape="circle"
              type="text"
              onClick={() => handleMarkNotification(notification.id)}
              loading={isLoading}
            >
              <FaCheck />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationCard;
