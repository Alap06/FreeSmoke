import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  USER_PROFILE: '@user_profile',
  QUIT_PLAN: '@quit_plan',
  CIGARETTE_LOGS: '@cigarette_logs',
  DAILY_SUMMARIES: '@daily_summaries',
  ACHIEVEMENTS: '@achievements',
  USER_PROGRESS: '@user_progress',
  MOOD_LOGS: '@mood_logs',
  CRAVING_EVENTS: '@craving_events',
  SETTINGS: '@settings',
};

// USER PROFILE
export const getUserProfile = async () => {
  try {
    const data = await AsyncStorage.getItem(KEYS.USER_PROFILE);
    return data ? JSON.parse(data) : null;
  } catch (e) { return null; }
};

export const saveUserProfile = async (profile) => {
  try {
    await AsyncStorage.setItem(KEYS.USER_PROFILE, JSON.stringify(profile));
  } catch (e) { console.error(e); }
};

// QUIT PLAN
export const getQuitPlan = async () => {
  try {
    const data = await AsyncStorage.getItem(KEYS.QUIT_PLAN);
    return data ? JSON.parse(data) : null;
  } catch (e) { return null; }
};

export const saveQuitPlan = async (plan) => {
  try {
    await AsyncStorage.setItem(KEYS.QUIT_PLAN, JSON.stringify(plan));
  } catch (e) { console.error(e); }
};

// CIGARETTE LOGS
export const getCigaretteLogs = async () => {
  try {
    const data = await AsyncStorage.getItem(KEYS.CIGARETTE_LOGS);
    return data ? JSON.parse(data) : [];
  } catch (e) { return []; }
};

export const saveCigaretteLogs = async (logs) => {
  try {
    await AsyncStorage.setItem(KEYS.CIGARETTE_LOGS, JSON.stringify(logs));
  } catch (e) { console.error(e); }
};

// ACHIEVEMENTS
export const getAchievements = async () => {
  try {
    const data = await AsyncStorage.getItem(KEYS.ACHIEVEMENTS);
    return data ? JSON.parse(data) : [];
  } catch (e) { return []; }
};

export const saveAchievements = async (achievements) => {
  try {
    await AsyncStorage.setItem(KEYS.ACHIEVEMENTS, JSON.stringify(achievements));
  } catch (e) { console.error(e); }
};

// USER PROGRESS
export const getUserProgress = async () => {
  try {
    const data = await AsyncStorage.getItem(KEYS.USER_PROGRESS);
    return data ? JSON.parse(data) : {
      totalXP: 0, currentLevel: 1, currentStreak: 0, longestStreak: 0, cravingsDefeated: 0,
    };
  } catch (e) {
    return { totalXP: 0, currentLevel: 1, currentStreak: 0, longestStreak: 0, cravingsDefeated: 0 };
  }
};

export const saveUserProgress = async (progress) => {
  try {
    await AsyncStorage.setItem(KEYS.USER_PROGRESS, JSON.stringify(progress));
  } catch (e) { console.error(e); }
};

// MOOD LOGS
export const getMoodLogs = async () => {
  try {
    const data = await AsyncStorage.getItem(KEYS.MOOD_LOGS);
    return data ? JSON.parse(data) : [];
  } catch (e) { return []; }
};

export const saveMoodLogs = async (logs) => {
  try {
    await AsyncStorage.setItem(KEYS.MOOD_LOGS, JSON.stringify(logs));
  } catch (e) { console.error(e); }
};

// CRAVING EVENTS
export const getCravingEvents = async () => {
  try {
    const data = await AsyncStorage.getItem(KEYS.CRAVING_EVENTS);
    return data ? JSON.parse(data) : [];
  } catch (e) { return []; }
};

export const saveCravingEvents = async (events) => {
  try {
    await AsyncStorage.setItem(KEYS.CRAVING_EVENTS, JSON.stringify(events));
  } catch (e) { console.error(e); }
};

// SETTINGS
export const getSettings = async () => {
  try {
    const data = await AsyncStorage.getItem(KEYS.SETTINGS);
    return data ? JSON.parse(data) : { theme: 'light', notifications: true };
  } catch (e) { return { theme: 'light', notifications: true }; }
};

export const saveSettings = async (settings) => {
  try {
    await AsyncStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
  } catch (e) { console.error(e); }
};

// CLEAR ALL
export const clearAllData = async () => {
  try {
    await AsyncStorage.multiRemove(Object.values(KEYS));
  } catch (e) { console.error(e); }
};