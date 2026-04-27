import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  Switch, TouchableOpacity, Alert,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import { COLORS } from '../constants';
import {
  createNotificationChannel, requestPermission,
  scheduleMorningNotification, scheduleEveningNotification,
  cancelNotification, cancelAllNotifications,
  sendInstantNotification,
} from '../services/NotificationService';

const NotificationsScreen = () => {
  const { theme } = useTheme();
  const { userProfile, quitPlan } = useApp();
  const [hasPermission, setHasPermission] = useState(false);
  const [morningEnabled, setMorningEnabled] = useState(false);
  const [eveningEnabled, setEveningEnabled] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    initNotifications();
  }, []);

  const initNotifications = async () => {
    await createNotificationChannel();
    const granted = await requestPermission();
    setHasPermission(granted);
  };

  const handleMorningToggle = async (value) => {
    setMorningEnabled(value);
    setLoading(true);
    if (value) {
      await scheduleMorningNotification(
        userProfile?.displayName || 'Champion',
        quitPlan?.currentDailyLimit || 10
      );
      Alert.alert('✅ Activé !', 'Tu recevras une motivation chaque matin à 8h00 !');
    } else {
      await cancelNotification('morning');
    }
    setLoading(false);
  };

  const handleEveningToggle = async (value) => {
    setEveningEnabled(value);
    setLoading(true);
    if (value) {
      await scheduleEveningNotification(userProfile?.displayName || 'Champion');
      Alert.alert('✅ Activé !', 'Tu recevras un rappel chaque soir à 20h00 !');
    } else {
      await cancelNotification('evening');
    }
    setLoading(false);
  };

  const handleTestNotif = async () => {
    await sendInstantNotification(
      'Test de notification',
      'FreeSmoke est pret a te motiver chaque jour ! 🚭',
      '🔔'
    );
  };

  const handleCancelAll = async () => {
    Alert.alert(
      'Desactiver tout',
      'Annuler toutes les notifications ?',
      [
        { text: 'Non', style: 'cancel' },
        { text: 'Oui', onPress: async () => {
          await cancelAllNotifications();
          setMorningEnabled(false);
          setEveningEnabled(false);
        }},
      ]
    );
  };

  const s = StyleSheet.create({
    container:    { flex: 1, backgroundColor: theme.background },
    scroll:       { padding: 16 },
    permCard:     { borderRadius: 16, padding: 16, marginBottom: 16 },
    card:         { backgroundColor: theme.card, borderRadius: 20, padding: 20, marginBottom: 14, elevation: 2 },
    cardTitle:    { fontSize: 16, fontWeight: 'bold', color: theme.text, marginBottom: 14 },
    row:          { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: theme.border },
    rowLeft:      { flex: 1, marginRight: 12 },
    rowLabel:     { fontSize: 15, fontWeight: '600', color: theme.text },
    rowDesc:      { fontSize: 12, color: theme.textSecondary, marginTop: 3 },
    testBtn:      { backgroundColor: COLORS.primary, borderRadius: 14, padding: 14, alignItems: 'center', marginBottom: 10 },
    testBtnText:  { color: '#fff', fontSize: 15, fontWeight: 'bold' },
    cancelBtn:    { borderRadius: 14, padding: 14, alignItems: 'center', borderWidth: 1, borderColor: theme.border },
    cancelBtnText:{ color: theme.textSecondary, fontSize: 15 },
    tipCard:      { backgroundColor: COLORS.primaryLight + '15', borderRadius: 16, padding: 16, borderLeftWidth: 4, borderLeftColor: COLORS.primary },
    tipText:      { fontSize: 13, color: theme.text, lineHeight: 20 },
  });

  return (
    <ScrollView style={s.container}>
      <View style={s.scroll}>

        {/* Permission status */}
        <View style={[s.permCard, { backgroundColor: hasPermission ? COLORS.primaryLight + '20' : '#FFEBEE' }]}>
          <Text style={{ fontSize: 15, fontWeight: 'bold', color: hasPermission ? COLORS.primary : COLORS.danger }}>
            {hasPermission ? '✅ Notifications autorisees' : '❌ Notifications non autorisees'}
          </Text>
          <Text style={{ fontSize: 13, color: theme.textSecondary, marginTop: 4 }}>
            {hasPermission ? 'Tu peux activer les rappels ci-dessous.' : 'Va dans Parametres > Applications > FreeSmoke pour autoriser.'}
          </Text>
        </View>

        {/* Rappels quotidiens */}
        <View style={s.card}>
          <Text style={s.cardTitle}>⏰ Rappels quotidiens</Text>
          <View style={s.row}>
            <View style={s.rowLeft}>
              <Text style={s.rowLabel}>🌅 Motivation matin</Text>
              <Text style={s.rowDesc}>Chaque jour a 8h00 — Message d\'encouragement personnalise</Text>
            </View>
            <Switch
              value={morningEnabled}
              onValueChange={handleMorningToggle}
              trackColor={{ false: COLORS.border, true: COLORS.primary }}
              thumbColor={morningEnabled ? '#fff' : '#f4f3f4'}
              disabled={!hasPermission || loading}
            />
          </View>
          <View style={[s.row, { borderBottomWidth: 0 }]}>
            <View style={s.rowLeft}>
              <Text style={s.rowLabel}>🌙 Bilan du soir</Text>
              <Text style={s.rowDesc}>Chaque jour a 20h00 — Rappel pour consulter ta progression</Text>
            </View>
            <Switch
              value={eveningEnabled}
              onValueChange={handleEveningToggle}
              trackColor={{ false: COLORS.border, true: COLORS.primary }}
              thumbColor={eveningEnabled ? '#fff' : '#f4f3f4'}
              disabled={!hasPermission || loading}
            />
          </View>
        </View>

        {/* Notifications automatiques */}
        <View style={s.card}>
          <Text style={s.cardTitle}>🤖 Notifications automatiques</Text>
          <View style={s.row}>
            <View style={s.rowLeft}>
              <Text style={s.rowLabel}>🏅 Badge debloque</Text>
              <Text style={s.rowDesc}>Notification immediate a chaque badge obtenu</Text>
            </View>
            <Text style={{ color: COLORS.primary, fontWeight: 'bold' }}>AUTO</Text>
          </View>
          <View style={s.row}>
            <View style={s.rowLeft}>
              <Text style={s.rowLabel}>🔥 Nouveau streak</Text>
              <Text style={s.rowDesc}>Felicitation a chaque palier de streak</Text>
            </View>
            <Text style={{ color: COLORS.primary, fontWeight: 'bold' }}>AUTO</Text>
          </View>
          <View style={[s.row, { borderBottomWidth: 0 }]}>
            <View style={s.rowLeft}>
              <Text style={s.rowLabel}>⚠️ Zone de danger</Text>
              <Text style={s.rowDesc}>Alerte avant tes heures habituelles de tabagisme</Text>
            </View>
            <Text style={{ color: COLORS.primary, fontWeight: 'bold' }}>AUTO</Text>
          </View>
        </View>

        {/* Test */}
        <TouchableOpacity style={s.testBtn} onPress={handleTestNotif} disabled={!hasPermission}>
          <Text style={s.testBtnText}>🔔 Tester une notification</Text>
        </TouchableOpacity>

        <TouchableOpacity style={s.cancelBtn} onPress={handleCancelAll}>
          <Text style={s.cancelBtnText}>🔕 Desactiver toutes les notifications</Text>
        </TouchableOpacity>

        <Spacer />

        <View style={[s.tipCard, { marginTop: 14 }]}>
          <Text style={s.tipText}>
            💡 Les notifications automatiques (badges, streaks) sont envoyees directement lors des evenements, sans configuration necessaire.
          </Text>
        </View>

      </View>
    </ScrollView>
  );
};

const Spacer = () => <View style={{ height: 14 }} />;

export default NotificationsScreen;