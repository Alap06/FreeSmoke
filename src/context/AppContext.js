import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  getUserProfile, saveUserProfile,
  getQuitPlan, saveQuitPlan,
  getCigaretteLogs, saveCigaretteLogs,
  getAchievements, saveAchievements,
  getUserProgress, saveUserProgress,
  getMoodLogs, saveMoodLogs,
  getCravingEvents, saveCravingEvents,
  getSettings, saveSettings,
} from '../services/StorageService';
import { getTodayString } from '../utils/dateUtils';
import { calculateStreak, getMoneySaved } from '../utils/streakCalculator';
import { BADGES_CONFIG, LEVELS } from '../constants';
import { saveProfileToServer } from '../services/AuthService';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [userProfile, setUserProfile]   = useState(null);
  const [quitPlan, setQuitPlan]         = useState(null);
  const [cigaretteLogs, setCigaretteLogs] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [userProgress, setUserProgress] = useState({
    totalXP: 0, currentLevel: 1, currentStreak: 0, longestStreak: 0, cravingsDefeated: 0,
  });
  const [moodLogs, setMoodLogs]         = useState([]);
  const [cravingEvents, setCravingEvents] = useState([]);
  const [settings, setSettings]         = useState({ theme: 'light', notifications: true });
  const [loading, setLoading]           = useState(true);
  const [onboardingDone, setOnboardingDone] = useState(false);

  // ── AUTH STATE ───────────────────────────────────────────
  const [authToken, setAuthToken]   = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    // Vérifier le token sauvegardé
    const token = await AsyncStorage.getItem('@auth_token');
    if (token) {
      setAuthToken(token);
      setIsLoggedIn(true);
    }

    const [profile, plan, logs, ach, progress, moods, cravings, sets] = await Promise.all([
      getUserProfile(), getQuitPlan(), getCigaretteLogs(),
      getAchievements(), getUserProgress(), getMoodLogs(),
      getCravingEvents(), getSettings(),
    ]);
    setUserProfile(profile);
    setQuitPlan(plan);
    setCigaretteLogs(logs || []);
    setAchievements(ach || []);
    setUserProgress(progress);
    setMoodLogs(moods || []);
    setCravingEvents(cravings || []);
    setSettings(sets);
    setOnboardingDone(!!profile);
    setLoading(false);
  };

  // ── PROFILE ─────────────────────────────────────────────
  const completeOnboarding = async (profile, plan) => {
    await saveUserProfile(profile);
    await saveQuitPlan(plan);
    setUserProfile(profile);
    setQuitPlan(plan);
    setOnboardingDone(true);

    // Sync avec le backend
    const token = await AsyncStorage.getItem('@auth_token');
    if (token) {
      await saveProfileToServer(token, profile, plan);
    }
  };

  // ── LOGOUT ───────────────────────────────────────────────
  const logout = async () => {
    await AsyncStorage.removeItem('@auth_token');
    await AsyncStorage.removeItem('@user_id');
    setAuthToken(null);
    setIsLoggedIn(false);
    setOnboardingDone(false);
    setUserProfile(null);
    setQuitPlan(null);
  };

  // ── CIGARETTE LOG ────────────────────────────────────────
  const logCigarette = async (trigger, note = '') => {
    const today = getTodayString();
    const newLog = {
      id: Date.now().toString(),
      date: today,
      timestamp: Date.now(),
      trigger,
      note,
    };
    const updated = [...cigaretteLogs, newLog];
    setCigaretteLogs(updated);
    await saveCigaretteLogs(updated);
    await awardXP(10, 'Cigarette logged');
    await checkBadges(updated, cravingEvents, userProgress);
    return newLog;
  };

  const undoLastLog = async () => {
    const today = getTodayString();
    const todayLogs = cigaretteLogs.filter(l => l.date === today);
    if (todayLogs.length === 0) return;
    const lastLog = todayLogs[todayLogs.length - 1];
    if (Date.now() - lastLog.timestamp > 10000) return;
    const updated = cigaretteLogs.filter(l => l.id !== lastLog.id);
    setCigaretteLogs(updated);
    await saveCigaretteLogs(updated);
  };

  const getTodayCount = () => {
    const today = getTodayString();
    return cigaretteLogs.filter(l => l.date === today).length;
  };

  const getTodayLimit = () => quitPlan?.currentDailyLimit || 20;

  const getTodayStatus = () => {
    const count = getTodayCount();
    const limit = getTodayLimit();
    if (count === 0) return 'perfect';
    if (count < limit * 0.7) return 'good';
    if (count < limit) return 'warning';
    return 'exceeded';
  };

  // ── CRAVING ──────────────────────────────────────────────
  const logCravingEvent = async (toolUsed, defeated = false, duration = 0) => {
    const newEvent = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      date: getTodayString(),
      toolUsed,
      defeated,
      duration,
    };
    const updated = [...cravingEvents, newEvent];
    setCravingEvents(updated);
    await saveCravingEvents(updated);
    if (defeated) {
      await awardXP(15, 'Craving defeated');
      const newProgress = { ...userProgress, cravingsDefeated: (userProgress.cravingsDefeated || 0) + 1 };
      setUserProgress(newProgress);
      await saveUserProgress(newProgress);
    }
    await checkBadges(cigaretteLogs, updated, userProgress);
  };

  // ── MOOD ─────────────────────────────────────────────────
  const logMood = async (moodScore, symptoms = [], sleepQuality = 3, note = '') => {
    const today = getTodayString();
    const existing = moodLogs.findIndex(m => m.date === today);
    const entry = { id: Date.now().toString(), date: today, moodScore, symptoms, sleepQuality, note };
    let updated;
    if (existing >= 0) {
      updated = moodLogs.map((m, i) => i === existing ? entry : m);
    } else {
      updated = [...moodLogs, entry];
    }
    setMoodLogs(updated);
    await saveMoodLogs(updated);
  };

  // ── XP & LEVELS ──────────────────────────────────────────
  const awardXP = async (xp, reason = '') => {
    const newTotal = (userProgress.totalXP || 0) + xp;
    const newLevel = LEVELS.reduce((acc, l) => newTotal >= l.minXP ? l.level : acc, 1);
    const newProgress = { ...userProgress, totalXP: newTotal, currentLevel: newLevel };
    setUserProgress(newProgress);
    await saveUserProgress(newProgress);
  };

  // ── BADGES ───────────────────────────────────────────────
  const checkBadges = async (logs, cravings, progress) => {
    const unlockedIds = achievements.map(a => a.id);
    const newBadges = [...achievements];
    let changed = false;

    const unlock = (id) => {
      if (!unlockedIds.includes(id)) {
        const badge = BADGES_CONFIG.find(b => b.id === id);
        if (badge) {
          newBadges.push({ id, unlockedAt: Date.now() });
          changed = true;
          awardXP(badge.xp, `Badge: ${badge.name}`);
        }
      }
    };

    if (logs.length >= 1) unlock('first_log');
    const streak = calculateStreak(logs.map(l => ({ date: l.date, underLimit: true })));
    if (streak >= 3) unlock('streak_3');
    if (streak >= 7) unlock('streak_7');
    if (streak >= 30) unlock('streak_30');
    const defeated = cravings.filter(c => c.defeated).length;
    if (defeated >= 5) unlock('craving_5');
    if (cravings.length >= 1) unlock('sos_used');

    if (changed) {
      setAchievements(newBadges);
      await saveAchievements(newBadges);
    }
  };

  // ── COMPUTED ─────────────────────────────────────────────
  const getMoneySavedTotal = () => {
    if (!userProfile) return 0;
    return getMoneySaved(
      Object.entries(
        cigaretteLogs.reduce((acc, l) => {
          acc[l.date] = (acc[l.date] || 0) + 1;
          return acc;
        }, {})
      ).map(([date, count]) => ({ date, count, underLimit: count < getTodayLimit() })),
      userProfile.packPrice || 10,
      userProfile.cigarsPerDay || 10,
    );
  };

  const getCurrentStreak = () => {
    return calculateStreak(
      Object.entries(
        cigaretteLogs.reduce((acc, l) => {
          acc[l.date] = (acc[l.date] || 0) + 1;
          return acc;
        }, {})
      ).map(([date, count]) => ({ date, count, underLimit: count < getTodayLimit() }))
    );
  };

  const updateSettings = async (updates) => {
    const updated = { ...settings, ...updates };
    setSettings(updated);
    await saveSettings(updated);
  };

  return (
    <AppContext.Provider value={{
      userProfile, quitPlan, cigaretteLogs, achievements,
      userProgress, moodLogs, cravingEvents, settings,
      loading, onboardingDone,
      authToken, isLoggedIn, setAuthToken, setIsLoggedIn,
      completeOnboarding, logCigarette, undoLastLog,
      getTodayCount, getTodayLimit, getTodayStatus,
      logCravingEvent, logMood, awardXP,
      getMoneySavedTotal, getCurrentStreak, updateSettings,
      logout,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);