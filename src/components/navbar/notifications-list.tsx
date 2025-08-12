import { Notification } from "@/types/notification";
import { Button, Empty } from "antd";
import NotificationCard from "./notification-card";

interface NotificationsListProps {
  notifications: Notification[];
}

const NotificationsList = ({ notifications }: NotificationsListProps) => {
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
      <div className="flex justify-end">
        <Button type="text">View All</Button>
      </div>
    </div>
  );
};

export default NotificationsList;
