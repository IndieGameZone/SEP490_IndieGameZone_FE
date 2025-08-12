import { Badge, Button, Popover } from "antd";
import { useEffect, useState } from "react";
import { IoIosNotifications } from "react-icons/io";
import NotificationsList from "./notifications-list";
import * as signalR from "@microsoft/signalr";
import { Notification } from "@/types/notification";
import useAuthStore from "@/store/use-auth-store";
import { getNotification } from "@/lib/api/notification-api";
const BASE_URL = import.meta.env.VITE_REACT_APP_API_URL;

const ViewNotificationsButton = () => {
  const [open, setOpen] = useState(false);
  const [connection, setConnection] = useState<signalR.HubConnection | null>(
    null
  );
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { profile } = useAuthStore();

  const fetchNotifications = async () => {
    if (!profile) return;
    const result = await getNotification(profile.id);
    if (!result.error) {
      setNotifications(result.data);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    const connectToHub = async () => {
      const newConnection = new signalR.HubConnectionBuilder()
        .withUrl(`${BASE_URL}/notification`, {
          accessTokenFactory() {
            return localStorage.getItem("accessToken") ?? "";
          },
        })
        .withAutomaticReconnect()
        .configureLogging(signalR.LogLevel.Information)
        .build();

      setConnection(newConnection);
    };

    connectToHub();
  }, []);

  useEffect(() => {
    if (connection) {
      connection
        .start()
        .then(() => {
          // console.log("Connected to Notification Hub");

          connection.on("SendNotification", () => {
            fetchNotifications();
          });
        })
        .catch((err) => console.error("SignalR Connection Error: ", err));

      return () => {
        connection.off("SendNotification");
        connection.stop();
      };
    }
  }, [connection]);

  const unreadNotifications = notifications.filter((x) => !x.isRead).length;

  return (
    <Badge count={unreadNotifications}>
      <Popover
        content={<NotificationsList notifications={notifications} />}
        title={<h2 className="font-bold">Notifications</h2>}
        trigger="click"
        open={open}
        onOpenChange={setOpen}
      >
        <Button shape="circle" icon={<IoIosNotifications />} />
      </Popover>
    </Badge>
  );
};

export default ViewNotificationsButton;
