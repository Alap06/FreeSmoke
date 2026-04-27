import React, { useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, Animated, Dimensions,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import { COLORS, TRIGGERS, LEVELS } from '../constants';

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const {
    userProfile, getTodayCount, getTodayLimit, getTodayStatus,
    cigaretteLogs, userProgress, getMoneySavedTotal, getCurrentStreak,
  } = useApp();

  const count = getTodayCount();
  const limit = getTodayLimit();
  const status = getTodayStatus();
  const streak = getCurrentStreak();
  const money = getMoneySavedTotal();
  const progressPercent = limit > 0 ? Math.min(1, count / limit) : 0;

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 600, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, friction: 5, useNativeDriver: true }),
    ]).start();
  }, []);

  const statusConfig = {
    perfect:  { color: '#52B788', label: '✨ Parfait !',          bg: '#D8F3DC', emoji: '🌟' },
    good:     { color: '#2D6A4F', label: '👍 Bonne journée !',    bg: '#D8F3DC', emoji: '💚' },
    warning:  { color: '#F4A261', label: '⚠️ Ralentis !',         bg: '#FFF3E0', emoji: '⚠️' },
    exceeded: { color: '#E63946', label: '🔴 Limite dépassée !',  bg: '#FFEBEE', emoji: '🚨' },
  };
  const sc = statusConfig[status];

  const currentLevel = LEVELS.find(l => l.level === userProgress.currentLevel) || LEVELS[0];
  const nextLevel = LEVELS.find(l => l.level === userProgress.currentLevel + 1);
  const xpProgress = nextLevel
    ? (userProgress.totalXP - currentLevel.minXP) / (nextLevel.minXP - currentLevel.minXP)
    : 1;

  const getGreeting = () => {
    const h = new Date().getHours();
    const name = userProfile?.displayName || '';
    if (h < 12) return { text: `Bonjour, ${name} !`, emoji: '🌅' };
    if (h < 18) return { text: `Bon après-midi, ${name} !`, emoji: '☀️' };
    return { text: `Bonsoir, ${name} !`, emoji: '🌙' };
  };
  const greeting = getGreeting();

  const triggerStats = TRIGGERS.map(t => ({
    ...t,
    count: cigaretteLogs.filter(l => l.trigger === t.id).length,
  })).filter(t => t.count > 0).sort((a, b) => b.count - a.count);

  const s = StyleSheet.create({
    container:     { flex: 1, backgroundColor: theme.background },
    scroll:        { flex: 1 },

    // Header
    header:        { backgroundColor: COLORS.primaryDark, paddingTop: 50, paddingBottom: 30, paddingHorizontal: 20 },
    greetingRow:   { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
    greetingEmoji: { fontSize: 24, marginRight: 8 },
    greetingText:  { fontSize: 22, fontWeight: 'bold', color: '#fff' },
    levelRow:      { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
    levelBadge:    { backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 4, flexDirection: 'row', alignItems: 'center' },
    levelText:     { color: '#A8D5BA', fontSize: 13, fontWeight: '600' },
    xpBarBg:       { flex: 1, height: 4, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 2, marginLeft: 10 },
    xpBarFill:     { height: 4, backgroundColor: COLORS.primaryLight, borderRadius: 2 },

    // Main counter card
    counterCard:   { margin: 16, marginTop: -20, backgroundColor: theme.card, borderRadius: 24, padding: 24, elevation: 8, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 12 },
    counterTop:    { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
    counterLabel:  { fontSize: 14, color: theme.textSecondary, fontWeight: '600' },
    statusPill:    { backgroundColor: sc.bg, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 4 },
    statusPillTxt: { color: sc.color, fontSize: 13, fontWeight: 'bold' },
    counterMiddle: { alignItems: 'center', marginBottom: 16 },
    counterNumber: { fontSize: 80, fontWeight: 'bold', color: sc.color, lineHeight: 88 },
    counterSub:    { fontSize: 15, color: theme.textSecondary, marginTop: 4 },
    progressBg:    { height: 10, backgroundColor: theme.border, borderRadius: 5 },
    progressFill:  { height: 10, borderRadius: 5, backgroundColor: sc.color },
    progressLabels:{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 },
    progressLbl:   { fontSize: 12, color: theme.textSecondary },

    // Stats row
    statsRow:      { flexDirection: 'row', marginHorizontal: 16, gap: 10, marginBottom: 14 },
    statCard:      { flex: 1, backgroundColor: theme.card, borderRadius: 18, padding: 14, alignItems: 'center', elevation: 2 },
    statEmoji:     { fontSize: 24, marginBottom: 4 },
    statValue:     { fontSize: 18, fontWeight: 'bold', color: theme.text },
    statLabel:     { fontSize: 11, color: theme.textSecondary, marginTop: 2, textAlign: 'center' },

    // Action buttons
    actionsTitle:  { fontSize: 16, fontWeight: 'bold', color: theme.text, marginHorizontal: 16, marginBottom: 10 },
    actionsGrid:   { flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: 16, gap: 10, marginBottom: 14 },
    actionBtn:     { width: (width - 52) / 2, borderRadius: 18, padding: 16, elevation: 3 },
    actionEmoji:   { fontSize: 28, marginBottom: 6 },
    actionTitle:   { fontSize: 15, fontWeight: 'bold', color: '#fff' },
    actionDesc:    { fontSize: 11, color: 'rgba(255,255,255,0.8)', marginTop: 2 },

    // Triggers
    triggersCard:  { marginHorizontal: 16, backgroundColor: theme.card, borderRadius: 20, padding: 18, marginBottom: 20, elevation: 2 },
    triggersTitle: { fontSize: 15, fontWeight: 'bold', color: theme.text, marginBottom: 12 },
    triggerRow:    { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
    triggerBar:    { flex: 1, height: 8, borderRadius: 4, marginHorizontal: 8 },
    triggerCount:  { fontSize: 13, fontWeight: 'bold', width: 25, textAlign: 'right' },

    // Empty state
    emptyCard:     { marginHorizontal: 16, backgroundColor: theme.card, borderRadius: 20, padding: 24, alignItems: 'center', marginBottom: 20, elevation: 2 },
    emptyEmoji:    { fontSize: 48, marginBottom: 10 },
    emptyTitle:    { fontSize: 18, fontWeight: 'bold', color: theme.text, marginBottom: 6 },
    emptyDesc:     { fontSize: 14, color: theme.textSecondary, textAlign: 'center', lineHeight: 20 },
  });

  const actions = [
    { title: 'Journal', desc: 'Enregistrer une cigarette', emoji: '🚬', color: COLORS.primary, screen: 'LogCigarette' },
    { title: 'SOS Envie', desc: 'Surmonter une envie', emoji: '🆘', color: COLORS.accent, screen: 'SOS' },
    { title: 'Coach IA', desc: 'Parler à ton coach', emoji: '🤖', color: COLORS.primaryDark, screen: 'AICoach' },
    { title: 'Mini-Jeux', desc: 'Distraction anti-envie', emoji: '🎮', color: '#457B9D', screen: 'MiniGames' },
  ];

  const totalTriggers = triggerStats.reduce((a, b) => a + b.count, 0);

  return (
    <View style={s.container}>
      <ScrollView style={s.scroll} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <Animated.View style={[s.header, { opacity: fadeAnim }]}>
          <View style={s.greetingRow}>
            <Text style={s.greetingEmoji}>{greeting.emoji}</Text>
            <Text style={s.greetingText}>{greeting.text}</Text>
          </View>
          <View style={s.levelRow}>
            <View style={s.levelBadge}>
              <Text style={s.levelText}>{currentLevel.icon} {currentLevel.name} • {userProgress.totalXP} XP</Text>
            </View>
            <View style={s.xpBarBg}>
              <View style={[s.xpBarFill, { width: `${Math.min(100, xpProgress * 100)}%` }]} />
            </View>
          </View>
        </Animated.View>

        {/* Counter Card */}
        <Animated.View style={[s.counterCard, { opacity: fadeAnim, transform: [{ translateY: slideAnim }, { scale: scaleAnim }] }]}>
          <View style={s.counterTop}>
            <Text style={s.counterLabel}>AUJOURD'HUI</Text>
            <View style={s.statusPill}>
              <Text style={s.statusPillTxt}>{sc.label}</Text>
            </View>
          </View>
          <View style={s.counterMiddle}>
            <Text style={s.counterNumber}>{count}</Text>
            <Text style={s.counterSub}>cigarette{count > 1 ? 's' : ''} sur {limit} autorisée{limit > 1 ? 's' : ''}</Text>
          </View>
          <View style={s.progressBg}>
            <Animated.View style={[s.progressFill, { width: `${progressPercent * 100}%` }]} />
          </View>
          <View style={s.progressLabels}>
            <Text style={s.progressLbl}>0</Text>
            <Text style={s.progressLbl}>{Math.round(limit / 2)}</Text>
            <Text style={s.progressLbl}>{limit}</Text>
          </View>
        </Animated.View>

        {/* Stats */}
        <Animated.View style={[s.statsRow, { opacity: fadeAnim }]}>
          <View style={s.statCard}>
            <Text style={s.statEmoji}>🔥</Text>
            <Text style={s.statValue}>{streak}</Text>
            <Text style={s.statLabel}>Jours streak</Text>
          </View>
          <View style={s.statCard}>
            <Text style={s.statEmoji}>💰</Text>
            <Text style={s.statValue}>{money}€</Text>
            <Text style={s.statLabel}>Économisés</Text>
          </View>
          <View style={s.statCard}>
            <Text style={s.statEmoji}>💪</Text>
            <Text style={s.statValue}>{userProgress.cravingsDefeated || 0}</Text>
            <Text style={s.statLabel}>Envies vaincues</Text>
          </View>
        </Animated.View>

        {/* Actions */}
        <Text style={s.actionsTitle}>Actions rapides</Text>
        <Animated.View style={[s.actionsGrid, { opacity: fadeAnim }]}>
          {actions.map(action => (
            <TouchableOpacity
              key={action.screen}
              style={[s.actionBtn, { backgroundColor: action.color }]}
              onPress={() => navigation.navigate(action.screen)}
              activeOpacity={0.85}
            >
              <Text style={s.actionEmoji}>{action.emoji}</Text>
              <Text style={s.actionTitle}>{action.title}</Text>
              <Text style={s.actionDesc}>{action.desc}</Text>
            </TouchableOpacity>
          ))}
        </Animated.View>

        {/* Triggers */}
        {triggerStats.length > 0 ? (
          <Animated.View style={[s.triggersCard, { opacity: fadeAnim }]}>
            <Text style={s.triggersTitle}>🎯 Vos déclencheurs</Text>
            {triggerStats.map(t => (
              <View key={t.id} style={s.triggerRow}>
                <Text style={{ fontSize: 18, width: 28 }}>{t.icon}</Text>
                <Text style={{ color: theme.text, fontSize: 13, width: 90 }}>{t.label}</Text>
                <View style={[s.triggerBar, { backgroundColor: t.color + '25' }]}>
                  <View style={{ height: 8, borderRadius: 4, backgroundColor: t.color, width: `${(t.count / totalTriggers) * 100}%` }} />
                </View>
                <Text style={[s.triggerCount, { color: t.color }]}>{t.count}</Text>
              </View>
            ))}
          </Animated.View>
        ) : (
          <View style={s.emptyCard}>
            <Text style={s.emptyEmoji}>🌱</Text>
            <Text style={s.emptyTitle}>Commence ton parcours !</Text>
            <Text style={s.emptyDesc}>Utilise le bouton Journal pour enregistrer tes cigarettes et suivre ta progression.</Text>
          </View>
        )}

      </ScrollView>
    </View>
  );
};

export default HomeScreen;