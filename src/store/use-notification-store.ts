import { Notification } from '@/types/notification';
import { create, StateCreator } from 'zustand';
import { immer } from 'zustand/middleware/immer';

type NotificationStore = {
    notifications: Notification[];
    markAsRead: (id: string) => void;
    markAllAsRead: () => void;
    addNotification: (notification: Notification) => void;
    setNotifications: (notifications: Notification[]) => void;
};

const notificationStoreInitializer: StateCreator<
    NotificationStore,
    [["zustand/immer", never]],
    [],
    NotificationStore
> = (set) => ({
    notifications: [],

    addNotification: (notification) =>
        set((state) => {
            state.notifications.push(notification);
        }),

    setNotifications: (notifications) =>
        set((state) => {
            state.notifications = notifications;
        }),

    markAsRead: (id) =>
        set((state) => {
            const notif = state.notifications.find((n) => n.id === id);
            if (notif) notif.isRead = true;
        }),

    markAllAsRead: () =>
        set((state) => {
            state.notifications.forEach((notif) => {
                notif.isRead = true;
            });
        }),
});

const useNotificationStore = create(immer(notificationStoreInitializer));
export default useNotificationStore;