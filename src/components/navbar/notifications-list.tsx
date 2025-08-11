import { useEffect, useState } from "react";
import * as signalR from "@microsoft/signalr";
const BASE_URL = import.meta.env.VITE_REACT_APP_API_URL;
type Notification = { title: string; message: string; time: Date };
const NotificationsList = () => {
  const [connection, setConnection] = useState<signalR.HubConnection | null>(
    null
  );
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const connectToHub = async () => {
      const newConnection = new signalR.HubConnectionBuilder()
        .withUrl(`${BASE_URL}/notification`, {
          accessTokenFactory() {
            return localStorage.getItem("accessToken") ?? ""
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
          console.log("Connected to Notification Hub");

          connection.on("ReceiveNotification", (title, message) => {
            const newNotification = { title, message, time: new Date() };
            setNotifications((prev) => [newNotification, ...prev]);
          });
        })
        .catch((err) => console.error("SignalR Connection Error: ", err));

      return () => {
        connection.stop();
      };
    }
  }, [connection]);

  return (
    <div>
      {notifications.length === 0 ? (
        <p>No notifications yet</p>
      ) : (
        <ul>
          {notifications.map((n, index) => (
            <li key={index}>
              <strong>{n.title}</strong> - {n.message}{" "}
              <em>({n.time.toLocaleTimeString()})</em>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NotificationsList;
