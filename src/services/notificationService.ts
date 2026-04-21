import * as Notifications from "expo-notifications";

// Configurar comportamento padrão de notificações
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

/**
 * Solicita permissão para enviar notificações
 */
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

/**
 * Envia uma notificação local
 */
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

/**
 * Envia uma notificação agendada (opcional - para extras)
 */
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

/**
 * Limpa todas as notificações
 */
export const clearAllNotifications = async () => {
  try {
    await Notifications.dismissAllNotificationsAsync();
  } catch (error) {
    console.error("Erro ao limpar notificações:", error);
  }
};

/**
 * Configura listener para quando notificação é recebida
 */
export const setupNotificationListener = (
  callback: (notification: Notifications.Notification) => void,
) => {
  const subscription = Notifications.addNotificationReceivedListener(callback);

  return () => {
    subscription.remove();
  };
};

/**
 * Configura listener para quando notificação é clicada
 */
export const setupNotificationResponseListener = (
  callback: (response: Notifications.NotificationResponse) => void,
) => {
  const subscription =
    Notifications.addNotificationResponseReceivedListener(callback);

  return () => {
    subscription.remove();
  };
};
