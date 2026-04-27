import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import { COLORS, BADGES_CONFIG, LEVELS } from '../constants';

const BadgesScreen = () => {
  const { theme } = useTheme();
  const { achievements, userProgress } = useApp();
  const unlockedIds = achievements.map(a => a.id);
  const currentLevel = LEVELS.find(l => l.level === userProgress.currentLevel) || LEVELS[0];
  const nextLevel = LEVELS.find(l => l.level === userProgress.currentLevel + 1);
  const xpProgress = nextLevel ? (userProgress.totalXP - currentLevel.minXP) / (nextLevel.minXP - currentLevel.minXP) : 1;

  const s = StyleSheet.create({
    container:  { flex: 1, backgroundColor: theme.background },
    header:     { backgroundColor: COLORS.primaryDark, padding: 20, paddingBottom: 30 },
    levelIcon:  { fontSize: 40, textAlign: 'center', marginBottom: 6 },
    levelName:  { fontSize: 20, fontWeight: 'bold', color: '#fff', textAlign: 'center' },
    xpText:     { color: '#A8D5BA', textAlign: 'center', marginTop: 4, fontSize: 13 },
    xpBar:      { height: 8, backgroundColor: '#1B4332', borderRadius: 4, marginTop: 12, marginHorizontal: 20 },
    xpFill:     { height: 8, backgroundColor: COLORS.primaryLight, borderRadius: 4 },
    badgeCount: { color: '#A8D5BA', textAlign: 'center', marginTop: 8, fontSize: 13 },
    grid:       { padding: 12 },
    badgeCard:  { width: '47%', margin: '1.5%', backgroundColor: theme.card, borderRadius: 18, padding: 16, alignItems: 'center', elevation: 2 },
    badgeLocked:{ opacity: 0.4 },
    badgeIcon:  { fontSize: 38, marginBottom: 8 },
    badgeName:  { fontSize: 14, fontWeight: 'bold', color: theme.text, textAlign: 'center' },
    badgeDesc:  { fontSize: 11, color: theme.textSecondary, textAlign: 'center', marginTop: 4 },
    badgeXP:    { fontSize: 12, color: COLORS.gold, marginTop: 6, fontWeight: 'bold' },
    unlockedTag:{ backgroundColor: COLORS.primaryLight + '30', borderRadius: 10, paddingHorizontal: 8, paddingVertical: 2, marginTop: 6 },
    unlockedTxt:{ fontSize: 11, color: COLORS.primary, fontWeight: '600' },
  });

  return (
    <View style={s.container}>
      <View style={s.header}>
        <Text style={s.levelIcon}>{currentLevel.icon}</Text>
        <Text style={s.levelName}>{currentLevel.name}</Text>
        <Text style={s.xpText}>{userProgress.totalXP} XP {nextLevel ? `/ ${nextLevel.minXP} XP` : '— MAX'}</Text>
        <View style={s.xpBar}>
          <View style={[s.xpFill, { width: `${Math.min(100, xpProgress * 100)}%` }]} />
        </View>
        <Text style={s.badgeCount}>{unlockedIds.length} / {BADGES_CONFIG.length} badges débloqués</Text>
      </View>
      <FlatList
        data={BADGES_CONFIG}
        keyExtractor={item => item.id}
        numColumns={2}
        contentContainerStyle={s.grid}
        renderItem={({ item }) => {
          const unlocked = unlockedIds.includes(item.id);
          return (
            <View style={[s.badgeCard, !unlocked && s.badgeLocked]}>
              <Text style={s.badgeIcon}>{unlocked ? item.icon : '🔒'}</Text>
              <Text style={s.badgeName}>{item.name}</Text>
              <Text style={s.badgeDesc}>{item.description}</Text>
              <Text style={s.badgeXP}>+{item.xp} XP</Text>
              {unlocked && <View style={s.unlockedTag}><Text style={s.unlockedTxt}>✅ Débloqué</Text></View>}
            </View>
          );
        }}
      />
    </View>
  );
};

export default BadgesScreen;