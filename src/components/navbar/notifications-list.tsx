import { Notification } from "@/types/notification";
import { Button, Empty } from "antd";
import NotificationCard from "./notification-card";
import { FaCheck } from "react-icons/fa";
import { useState } from "react";
import { markAllNotification } from "@/lib/api/notification-api";
import useAuthStore from "@/store/use-auth-store";
import useNotificationStore from "@/store/use-notification-store";

interface NotificationsListProps {
  notifications: Notification[];
}

const NotificationsList = ({ notifications }: NotificationsListProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { profile } = useAuthStore();
  const { markAllAsRead } = useNotificationStore();

  const handleMarkAllNotification = async () => {
    if (!profile) return;
    setIsLoading(true);
    const result = await markAllNotification(profile.id);
    setIsLoading(false);
    if (!result.error) {
      markAllAsRead();
    }
  };
  const allRead = notifications.every((n) => n.isRead);

  return (
    <div>
      <div className="w-[350px] max-h-[400px] overflow-auto">
        {notifications.length === 0 ? (
          <div className="py-20">
            <Empty description="No notifications yet" />
          </div>
        ) : (
          <ul>
            {notifications.map((n) => {
              return (
                <li key={n.id}>
                  <NotificationCard notification={n} />
                </li>
              );
            })}
          </ul>
        )}
      </div>
      <div className="flex justify-between gap-1">
        <Button
          type="text"
          icon={<FaCheck />}
          onClick={handleMarkAllNotification}
          loading={isLoading}
          disabled={isLoading || allRead}
        >
          Mark all as read
        </Button>
        <Button type="text">View All</Button>
      </div>
    </div>
  );
};

export default NotificationsList;
