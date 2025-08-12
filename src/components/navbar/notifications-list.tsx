import { Notification } from "@/types/notification";
import { Button, Empty } from "antd";

type NotificationsListProps = {
  notifications: Notification[];
};
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
                <li
                  key={n.id}
                  className={`p-2 hover:bg-zinc-800 rounded duration-300`}
                >
                  <p className={`${n.isRead ? "" : "font-bold"}`}>
                    {n.message}
                  </p>
                  <em className="text-zinc-400">
                    {new Date().toLocaleTimeString()} -{" "}
                    {new Date().toLocaleDateString()}
                  </em>
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
