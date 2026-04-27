import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import { COLORS, HEALTH_MILESTONES } from '../constants';

const JourneyScreen = () => {
  const { theme } = useTheme();
  const { quitPlan, userProfile, getCurrentStreak, cigaretteLogs } = useApp();

  const streak = getCurrentStreak();
  const limit = quitPlan?.currentDailyLimit || 20;
  const baseline = userProfile?.cigarsPerDay || 20;
  const reductionPercent = Math.round(((baseline - limit) / baseline) * 100);

  const daysToQuit = () => {
    if (!quitPlan?.targetQuitDate) return '—';
    const days = Math.ceil((new Date(quitPlan.targetQuitDate) - Date.now()) / 86400000);
    return days > 0 ? days : '🎉 Jour J !';
  };

  const s = StyleSheet.create({
    container:   { flex: 1, backgroundColor: theme.background },
    scroll:      { padding: 16 },
    card:        { backgroundColor: theme.card, borderRadius: 20, padding: 20, marginBottom: 14, elevation: 2 },
    cardTitle:   { fontSize: 17, fontWeight: 'bold', color: theme.text, marginBottom: 14 },
    quitCard:    { backgroundColor: COLORS.primaryDark, borderRadius: 20, padding: 24, marginBottom: 14, alignItems: 'center' },
    quitDays:    { fontSize: 56, fontWeight: 'bold', color: '#fff' },
    quitLabel:   { fontSize: 16, color: '#A8D5BA', marginTop: 4 },
    infoRow:     { flexDirection: 'row', gap: 10, marginBottom: 14 },
    infoBox:     { flex: 1, backgroundColor: theme.card, borderRadius: 16, padding: 16, alignItems: 'center', elevation: 2 },
    infoVal:     { fontSize: 22, fontWeight: 'bold', color: COLORS.primary },
    infoLbl:     { fontSize: 11, color: theme.textSecondary, marginTop: 4, textAlign: 'center' },
    milestoneRow:{ flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 14, marginBottom: 8 },
    timelineItem:{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 16 },
    dot:         { width: 12, height: 12, borderRadius: 6, backgroundColor: COLORS.primary, marginTop: 4, marginRight: 12 },
    dotInactive: { backgroundColor: theme.border },
    line:        { width: 2, flex: 1, backgroundColor: COLORS.primaryLight + '40', marginLeft: 5, marginBottom: -8, marginTop: 4 },
  });

  const weeklyTargets = [];
  if (quitPlan) {
    const weeks = Math.ceil(baseline / Math.max(1, quitPlan.weeklyReduction));
    for (let i = 0; i <= weeks; i++) {
      weeklyTargets.push({
        week: i,
        target: Math.max(0, baseline - i * quitPlan.weeklyReduction),
        done: i * 7 <= streak,
      });
    }
  }

  return (
    <ScrollView style={s.container}>
      <View style={s.scroll}>
        {/* Countdown */}
        <View style={s.quitCard}>
          <Text style={{ fontSize: 14, color: '#A8D5BA', marginBottom: 4 }}>Jour J dans</Text>
          <Text style={s.quitDays}>{daysToQuit()}</Text>
          <Text style={s.quitLabel}>jours</Text>
          {quitPlan?.targetQuitDate && (
            <Text style={{ color: '#A8D5BA', marginTop: 8, fontSize: 13 }}>
              Objectif : {new Date(quitPlan.targetQuitDate).toLocaleDateString('fr-FR')}
            </Text>
          )}
        </View>

        {/* Info */}
        <View style={s.infoRow}>
          <View style={s.infoBox}>
            <Text style={s.infoVal}>{limit}</Text>
            <Text style={s.infoLbl}>Limite actuelle/jour</Text>
          </View>
          <View style={s.infoBox}>
            <Text style={s.infoVal}>-{reductionPercent}%</Text>
            <Text style={s.infoLbl}>Réduction</Text>
          </View>
          <View style={s.infoBox}>
            <Text style={s.infoVal}>🔥 {streak}</Text>
            <Text style={s.infoLbl}>Jours streak</Text>
          </View>
        </View>

        {/* Timeline */}
        <View style={s.card}>
          <Text style={s.cardTitle}>🗺️ Feuille de route</Text>
          {weeklyTargets.map((w, i) => (
            <View key={i} style={s.timelineItem}>
              <View>
                <View style={[s.dot, !w.done && s.dotInactive]} />
                {i < weeklyTargets.length - 1 && <View style={s.line} />}
              </View>
              <View style={{ flex: 1, paddingBottom: 8 }}>
                <Text style={{ fontWeight: 'bold', color: w.done ? COLORS.primary : theme.text }}>
                  {w.week === 0 ? 'Début' : `Semaine ${w.week}`} {w.done ? '✅' : ''}
                </Text>
                <Text style={{ color: theme.textSecondary, fontSize: 13 }}>
                  {w.target === 0 ? '🎉 Zéro cigarette !' : `Limite : ${w.target} cig/jour`}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Health milestones */}
        <View style={s.card}>
          <Text style={s.cardTitle}>💚 Bénéfices santé</Text>
          {HEALTH_MILESTONES.map(m => {
            const isUnlocked = streak >= (m.unit === 'd' ? m.time : 0);
            return (
              <View key={m.id} style={[s.milestoneRow, { backgroundColor: isUnlocked ? COLORS.primaryLight + '20' : theme.border + '30' }]}>
                <Text style={{ fontSize: 22, marginRight: 12 }}>{isUnlocked ? m.icon : '🔒'}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontWeight: 'bold', color: isUnlocked ? COLORS.primary : theme.textSecondary }}>{m.title}</Text>
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

export default JourneyScreen;