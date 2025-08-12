import { markNotification } from "@/lib/api/notification-api";
import useAuthStore from "@/store/use-auth-store";
import useNotificationStore from "@/store/use-notification-store";
import { Notification } from "@/types/notification";
import { Button } from "antd";
import { useState } from "react";
import { FaCheck } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

interface NotificationCardProps {
  notification: Notification;
}
const NotificationCard = ({ notification }: NotificationCardProps) => {
  const { markAsRead } = useNotificationStore();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { profile } = useAuthStore();

  const handleMarkNotification = async (notifId: string) => {
    setIsLoading(true);
    const result = await markNotification(notifId);
    setIsLoading(false);
    if (!result.error) {
      markAsRead(notifId);
    }
  };

  const handleNotificationClick = () => {
    if (!profile) return;

    if (!notification.isRead) {
      handleMarkNotification(notification.id);
    }

    const message = notification.message.toLowerCase();
    const { role } = profile;

    const navigateByKeyword = () => {
      if (role.name === "Developer") {
        if (message.includes("game")) return "/dev/manage-games";
        if (message.includes("withdraw request")) return "/dev/earnings";
      }
      if (message.includes("report")) {
        if (role.name == "Admin" || role.name == "Moderator") {
          return "/admin/manage-report";
        } else {
          return "/account/manage-sent-reports";
        }
      }
      if (message.includes("achievement")) return `/profile/${profile.id}`;

      return null;
    };

    const path = navigateByKeyword();
    if (path) navigate(path);
  };

  return (
    <div
      className={`p-2 hover:bg-zinc-800 rounded duration-300 cursor-pointer`}
      onClick={handleNotificationClick}
    >
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
              onClick={(e) => {
                e.stopPropagation();
                handleMarkNotification(notification.id);
              }}
              disabled={isLoading}
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
