import { getTodayString } from './dateUtils';

export const calculateStreak = (logs) => {
  if (!logs || logs.length === 0) return 0;

  const completedDays = [...new Set(
    logs
      .filter(l => l.underLimit)
      .map(l => l.date)
  )].sort().reverse();

  if (completedDays.length === 0) return 0;

  let streak = 0;
  let currentDate = new Date();

  for (let i = 0; i < completedDays.length; i++) {
    const expected = currentDate.toISOString().split('T')[0];
    if (completedDays[i] === expected) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
};

export const getMoneySaved = (logs, packPrice, baselinePerDay) => {
  if (!logs || logs.length === 0) return 0;
  const totalSmoked = logs.reduce((acc, l) => acc + (l.count || 0), 0);
  const days = new Set(logs.map(l => l.date)).size;
  const baseline = baselinePerDay * days;
  const saved = Math.max(0, baseline - totalSmoked);
  return parseFloat(((saved / 20) * packPrice).toFixed(2));
};

export const getHealthScore = (streak, reductionPercent) => {
  const streakBonus = Math.min(30, streak);
  const reductionScore = Math.min(70, reductionPercent * 0.7);
  return Math.min(100, Math.round(streakBonus + reductionScore));
};