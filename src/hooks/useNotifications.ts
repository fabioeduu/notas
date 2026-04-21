import * as Notifications from "expo-notifications";
import { useEffect } from "react";
import {
    setupNotificationListener,
    setupNotificationResponseListener,
} from "../services/notificationService";

/**
 * Hook para configurar listeners de notificações
 */
export const useNotifications = (
  onNotificationReceived?: (notification: Notifications.Notification) => void,
  onNotificationResponse?: (
    response: Notifications.NotificationResponse,
  ) => void,
) => {
  useEffect(() => {
    let unsubscribeReceived: (() => void) | undefined;
    let unsubscribeResponse: (() => void) | undefined;

    if (onNotificationReceived) {
      unsubscribeReceived = setupNotificationListener(onNotificationReceived);
    }

    if (onNotificationResponse) {
      unsubscribeResponse = setupNotificationResponseListener(
        onNotificationResponse,
      );
    }

    return () => {
      unsubscribeReceived?.();
      unsubscribeResponse?.();
    };
  }, [onNotificationReceived, onNotificationResponse]);
};
