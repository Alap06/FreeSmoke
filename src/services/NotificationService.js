import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configuration initiale pour le comportement des notifications quand l'app est au premier plan
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// Créer le canal de notifications Android
export const createNotificationChannel = async () => {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('freesmoke', {
      name: 'FreeSmoke',
      description: 'Notifications de suivi et motivation FreeSmoke',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#2D6A4F',
    });
  }
};

// Demander la permission
export const requestPermission = async () => {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  return finalStatus === 'granted';
};

// Notification immédiate
export const sendInstantNotification = async (title, body, emoji = '🚭') => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: `${emoji} ${title}`,
      body,
      color: '#2D6A4F',
    },
    trigger: null, // Envoi immédiat
  });
};

// Notification quotidienne matin (8h00)
export const scheduleMorningNotification = async (userName, dailyLimit) => {
  await cancelNotification('morning');
  
  await Notifications.scheduleNotificationAsync({
    identifier: 'morning',
    content: {
      title: `🌅 Bonjour ${userName} !`,
      body: `Nouvelle journee, nouvel objectif. Limite du jour : ${dailyLimit} cigarettes. Tu peux le faire ! 💪`,
      color: '#2D6A4F',
    },
    trigger: {
      hour: 8,
      minute: 0,
      repeats: true,
    },
  });
};

// Notification quotidienne soir (20h00)
export const scheduleEveningNotification = async (userName) => {
  await cancelNotification('evening');
  
  await Notifications.scheduleNotificationAsync({
    identifier: 'evening',
    content: {
      title: `🌙 Bilan du soir`,
      body: `Comment s'est passee ta journee ${userName} ? Ouvre FreeSmoke pour voir ta progression ! 📊`,
      color: '#2D6A4F',
    },
    trigger: {
      hour: 20,
      minute: 0,
      repeats: true,
    },
  });
};

// Notification de felicitation streak
export const sendStreakNotification = async (streak) => {
  await sendInstantNotification(
    `${streak} jours de streak ! 🔥`,
    `Incroyable ! Tu maintiens ta serie depuis ${streak} jours. Continue comme ca, tu es un champion !`,
    '🏆'
  );
};

// Notification badge debloque
export const sendBadgeNotification = async (badgeName, badgeIcon) => {
  await sendInstantNotification(
    'Badge debloque !',
    `Felicitations ! Tu viens de debloquer le badge "${badgeName}" ${badgeIcon}. Continue sur ta lancee !`,
    '🏅'
  );
};

// Notification SOS (envie detectee)
export const sendCravingAlertNotification = async (hour) => {
  await sendInstantNotification(
    'Zone de danger detectee !',
    `Tu fumes souvent vers ${hour}h. Ouvre l'outil SOS maintenant pour prevenir l'envie ! 💪`,
    '⚠️'
  );
};

// Annuler une notification specifique
export const cancelNotification = async (id) => {
  try {
    await Notifications.cancelScheduledNotificationAsync(id);
  } catch (e) {}
};

// Annuler toutes les notifications
export const cancelAllNotifications = async () => {
  await Notifications.cancelAllScheduledNotificationsAsync();
};

// Obtenir les notifications planifiees
export const getScheduledNotifications = async () => {
  return await Notifications.getAllScheduledNotificationsAsync();
};