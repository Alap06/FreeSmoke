import React from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, TouchableOpacity, Alert } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import { COLORS, LEVELS } from '../constants';
import { clearAllData } from '../services/StorageService';

const ProfileScreen = ({ navigation }) => {
  const { theme, isDark, toggleTheme } = useTheme();
  const { userProfile, quitPlan, userProgress, updateSettings } = useApp();
  const currentLevel = LEVELS.find(l => l.level === userProgress.currentLevel) || LEVELS[0];

  const confirmReset = () => {
    Alert.alert('Réinitialiser', 'Effacer toutes les données ?', [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Effacer', style: 'destructive', onPress: async () => { await clearAllData(); } },
    ]);
  };

  const s = StyleSheet.create({
    container:   { flex: 1, backgroundColor: theme.background },
    scroll:      { padding: 16 },
    profileCard: { backgroundColor: COLORS.primaryDark, borderRadius: 20, padding: 24, marginBottom: 14, alignItems: 'center' },
    avatar:      { fontSize: 56, marginBottom: 8 },
    name:        { fontSize: 22, fontWeight: 'bold', color: '#fff' },
    level:       { color: '#A8D5BA', fontSize: 14, marginTop: 4 },
    card:        { backgroundColor: theme.card, borderRadius: 20, padding: 20, marginBottom: 14, elevation: 2 },
    cardTitle:   { fontSize: 16, fontWeight: 'bold', color: theme.text, marginBottom: 14 },
    row:         { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: theme.border },
    rowLabel:    { fontSize: 15, color: theme.text },
    rowValue:    { fontSize: 15, color: theme.textSecondary, fontWeight: '600' },
    resetBtn:    { backgroundColor: '#FFEBEE', borderRadius: 14, padding: 16, alignItems: 'center', marginTop: 8 },
    resetText:   { color: COLORS.danger, fontSize: 15, fontWeight: 'bold' },
  });

  return (
    <ScrollView style={s.container}>
      <View style={s.scroll}>
        <View style={s.profileCard}>
          <Text style={s.avatar}>🚭</Text>
          <Text style={s.name}>{userProfile?.displayName || 'Utilisateur'}</Text>
          <Text style={s.level}>{currentLevel.icon} {currentLevel.name} — {userProgress.totalXP} XP</Text>
        </View>

        <View style={s.card}>
          <Text style={s.cardTitle}>👤 Mon profil</Text>
          <View style={s.row}><Text style={s.rowLabel}>Cigarettes/jour (base)</Text><Text style={s.rowValue}>{userProfile?.cigarsPerDay || '—'}</Text></View>
          <View style={s.row}><Text style={s.rowLabel}>Prix du paquet</Text><Text style={s.rowValue}>{userProfile?.packPrice || '—'}€</Text></View>
          <View style={s.row}><Text style={s.rowLabel}>Années de tabagisme</Text><Text style={s.rowValue}>{userProfile?.smokeYears || '—'} ans</Text></View>
          <View style={s.row}><Text style={s.rowLabel}>Dépendance</Text><Text style={s.rowValue}>{userProfile?.dependencyLevel || '—'}</Text></View>
          <View style={s.row}><Text style={s.rowLabel}>Style d'arrêt</Text><Text style={s.rowValue}>{userProfile?.quitStyle || '—'}</Text></View>
        </View>

        <View style={s.card}>
          <Text style={s.cardTitle}>📊 Mon plan</Text>
          <View style={s.row}><Text style={s.rowLabel}>Limite actuelle</Text><Text style={s.rowValue}>{quitPlan?.currentDailyLimit || '—'} cig/j</Text></View>
          <View style={s.row}><Text style={s.rowLabel}>Réduction/semaine</Text><Text style={s.rowValue}>-{quitPlan?.weeklyReduction || '—'} cig</Text></View>
          <View style={s.row}><Text style={s.rowLabel}>Date objectif</Text><Text style={s.rowValue}>{quitPlan?.targetQuitDate ? new Date(quitPlan.targetQuitDate).toLocaleDateString('fr-FR') : '—'}</Text></View>
        </View>

        <View style={s.card}>
          <Text style={s.cardTitle}>⚙️ Paramètres</Text>
          <View style={s.row}>
            <Text style={s.rowLabel}>Mode sombre</Text>
            <Switch value={isDark} onValueChange={toggleTheme} trackColor={{ false: COLORS.border, true: COLORS.primary }} thumbColor="#fff" />
          </View>
          <TouchableOpacity
  style={[s.row, { borderBottomWidth: 0 }]}
  onPress={() => navigation.navigate('Notifications')}
>
  <Text style={s.rowLabel}>🔔 Notifications</Text>
  <Text style={{ color: COLORS.primary, fontWeight: 'bold' }}>Gerer →</Text>
</TouchableOpacity>
        </View>

        <View style={s.card}>
          <Text style={s.cardTitle}>ℹ️ À propos</Text>
          <View style={s.row}><Text style={s.rowLabel}>Version</Text><Text style={s.rowValue}>1.0.0</Text></View>
          <View style={s.row}><Text style={s.rowLabel}>Technologie</Text><Text style={s.rowValue}>React Native 0.84</Text></View>
        </View>

        <TouchableOpacity style={s.resetBtn} onPress={confirmReset}>
          <Text style={s.resetText}>🗑️ Réinitialiser toutes les données</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default ProfileScreen;