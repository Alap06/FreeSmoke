import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import { COLORS, TRIGGERS, HEALTH_MILESTONES } from '../constants';
import { getLast7Days, formatShortDate } from '../utils/dateUtils';

const { width } = Dimensions.get('window');

const AnalyticsScreen = () => {
  const { theme } = useTheme();
  const { cigaretteLogs, userProfile, quitPlan, getMoneySavedTotal, getCurrentStreak } = useApp();
  const [range, setRange] = useState(7);

  const days = getLast7Days();
  const getCountForDay = (date) => cigaretteLogs.filter(l => l.date === date).length;
  const maxCount = Math.max(...days.map(getCountForDay), 1);

  const weeklyRate = () => {
    const limit = quitPlan?.currentDailyLimit || 20;
    const total = limit * 7;
    if (total === 0) return 0;
    const smoked = days.reduce((acc, d) => acc + getCountForDay(d), 0);
    return Math.max(0, Math.round(((total - smoked) / total) * 100));
  };

  const triggerData = TRIGGERS.map(t => ({
    ...t,
    count: cigaretteLogs.filter(l => l.trigger === t.id).length,
  })).sort((a, b) => b.count - a.count);
  const totalTriggers = triggerData.reduce((a, b) => a + b.count, 0);

  const smoke_free_days = () => {
    if (!quitPlan?.startDate) return 0;
    return Math.floor((Date.now() - new Date(quitPlan.startDate).getTime()) / 86400000);
  };

  const getUnlockedMilestones = () => {
    const daysSmokeReduced = getCurrentStreak();
    return HEALTH_MILESTONES.filter(m => {
      if (m.unit === 'min') return daysSmokeReduced > 0;
      if (m.unit === 'h')   return daysSmokeReduced > 0;
      if (m.unit === 'd')   return daysSmokeReduced >= m.time;
      return false;
    });
  };

  const s = StyleSheet.create({
    container:    { flex: 1, backgroundColor: theme.background },
    scroll:       { padding: 16 },
    card:         { backgroundColor: theme.card, borderRadius: 20, padding: 20, marginBottom: 14, elevation: 2 },
    cardTitle:    { fontSize: 17, fontWeight: 'bold', color: theme.text, marginBottom: 14 },
    bigNumber:    { fontSize: 52, fontWeight: 'bold', color: COLORS.primary, textAlign: 'center' },
    bigLabel:     { textAlign: 'center', color: theme.textSecondary, marginTop: 4 },
    chart:        { flexDirection: 'row', alignItems: 'flex-end', height: 120, gap: 6 },
    barWrap:      { flex: 1, alignItems: 'center' },
    barBg:        { width: '100%', backgroundColor: theme.border, borderRadius: 6, height: 90, justifyContent: 'flex-end' },
    barFill:      { borderRadius: 6, backgroundColor: COLORS.primary, minHeight: 4 },
    barLabel:     { fontSize: 9, color: theme.textSecondary, marginTop: 4, textAlign: 'center' },
    barVal:       { fontSize: 10, color: theme.text, marginBottom: 2, textAlign: 'center' },
    statsRow:     { flexDirection: 'row', gap: 10, marginBottom: 14 },
    statBox:      { flex: 1, backgroundColor: theme.card, borderRadius: 16, padding: 16, alignItems: 'center', elevation: 2 },
    statVal:      { fontSize: 22, fontWeight: 'bold', color: COLORS.primary },
    statLbl:      { fontSize: 11, color: theme.textSecondary, marginTop: 4, textAlign: 'center' },
    trigRow:      { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
    trigBar:      { height: 8, borderRadius: 4, marginHorizontal: 8, flex: 1 },
    milestoneRow: { flexDirection: 'row', alignItems: 'center', padding: 10, borderRadius: 12, marginBottom: 8 },
  });

  const unlocked = getUnlockedMilestones();

  return (
    <ScrollView style={s.container}>
      <View style={s.scroll}>
        {/* Rate */}
        <View style={s.card}>
          <Text style={s.cardTitle}>📊 Taux de réduction</Text>
          <Text style={s.bigNumber}>{weeklyRate()}%</Text>
          <Text style={s.bigLabel}>cette semaine</Text>
        </View>

        {/* Stats Row */}
        <View style={s.statsRow}>
          <View style={s.statBox}>
            <Text style={s.statVal}>💰 {getMoneySavedTotal()}€</Text>
            <Text style={s.statLbl}>Économisés</Text>
          </View>
          <View style={s.statBox}>
            <Text style={s.statVal}>🔥 {getCurrentStreak()}</Text>
            <Text style={s.statLbl}>Jours streak</Text>
          </View>
          <View style={s.statBox}>
            <Text style={s.statVal}>📅 {smoke_free_days()}</Text>
            <Text style={s.statLbl}>Jours depuis début</Text>
          </View>
        </View>

        {/* Chart */}
        <View style={s.card}>
          <Text style={s.cardTitle}>📅 7 derniers jours</Text>
          <View style={s.chart}>
            {days.map(date => {
              const c = getCountForDay(date);
              const h = Math.max(4, (c / maxCount) * 90);
              return (
                <View key={date} style={s.barWrap}>
                  <Text style={s.barVal}>{c}</Text>
                  <View style={s.barBg}>
                    <View style={[s.barFill, { height: h }]} />
                  </View>
                  <Text style={s.barLabel}>{formatShortDate(date)}</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Triggers */}
        <View style={s.card}>
          <Text style={s.cardTitle}>🎯 Déclencheurs</Text>
          {triggerData.map(t => (
            <View key={t.id} style={s.trigRow}>
              <Text style={{ width: 30 }}>{t.icon}</Text>
              <Text style={{ color: theme.text, width: 90, fontSize: 13 }}>{t.label}</Text>
              <View style={[s.trigBar, { backgroundColor: t.color + '30' }]}>
                <View style={{ height: 8, borderRadius: 4, backgroundColor: t.color, width: totalTriggers > 0 ? `${(t.count / totalTriggers) * 100}%` : '0%' }} />
              </View>
              <Text style={{ color: theme.textSecondary, fontSize: 12, width: 25 }}>{t.count}</Text>
            </View>
          ))}
        </View>

        {/* Health Milestones */}
        <View style={s.card}>
          <Text style={s.cardTitle}>🏥 Bénéfices santé</Text>
          {HEALTH_MILESTONES.map(m => {
            const isUnlocked = unlocked.some(u => u.id === m.id);
            return (
              <View key={m.id} style={[s.milestoneRow, { backgroundColor: isUnlocked ? COLORS.primaryLight + '20' : theme.border + '40', opacity: isUnlocked ? 1 : 0.5 }]}>
                <Text style={{ fontSize: 24, marginRight: 12 }}>{isUnlocked ? m.icon : '🔒'}</Text>
                <View>
                  <Text style={{ fontWeight: 'bold', color: theme.text, fontSize: 14 }}>{m.title}</Text>
                  <Text style={{ color: theme.textSecondary, fontSize: 12 }}>{m.desc}</Text>
                </View>
              </View>
            );
          })}
        </View>
      </View>
    </ScrollView>
  );
};

export default AnalyticsScreen;