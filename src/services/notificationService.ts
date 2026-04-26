import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export const requestNotificationPermission = async (): Promise<boolean> => {
  try {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();

    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    return finalStatus === "granted";
  } catch (error) {
    console.error("Erro ao solicitar permissão de notificações:", error);
    return false;
  }
};

export const sendNotification = async (
  title: string,
  body: string,
  data?: Record<string, any>,
) => {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        sound: true,
        badge: 1,
        data: data || {},
      },
      trigger: null, // null = imediato
    });
  } catch (error) {
    console.error("Erro ao enviar notificação:", error);
  }
};

export const scheduleNotification = async (
  title: string,
  body: string,
  delayInSeconds: number,
  data?: Record<string, any>,
) => {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        sound: true,
        badge: 1,
        data: data || {},
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: delayInSeconds,
        repeats: false,
      },
    });
  } catch (error) {
    console.error("Erro ao agendar notificação:", error);
  }
};

export const clearAllNotifications = async () => {
  try {
    await Notifications.dismissAllNotificationsAsync();
  } catch (error) {
    console.error("Erro ao limpar notificações:", error);
  }
};

export const setupNotificationListener = (
  callback: (notification: Notifications.Notification) => void,
) => {
  const subscription = Notifications.addNotificationReceivedListener(callback);

  return () => {
    subscription.remove();
  };
};

export const setupNotificationResponseListener = (
  callback: (response: Notifications.NotificationResponse) => void,
) => {
  const subscription =
    Notifications.addNotificationResponseReceivedListener(callback);

  return () => {
    subscription.remove();
  };
};
